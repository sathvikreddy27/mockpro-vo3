import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, answer, interviewType } = await req.json();
    
    if (!question || !answer) {
      throw new Error('Question and answer are required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create evaluation prompt
    const systemPrompt = `You are an expert interview coach evaluating candidate responses. 
Your task is to evaluate answers based on:
1. Communication clarity (how well they express ideas)
2. Confidence (tone and conviction in their answer)
3. Grammar and language quality
4. Relevance to the question asked

For ${interviewType === 'technical' ? 'technical' : 'HR'} questions, ${
      interviewType === 'technical'
        ? 'also assess technical accuracy and problem-solving approach'
        : 'also assess behavioral examples and soft skills demonstration'
    }.

Provide scores from 1-10 for each criterion and an overall score from 0-100.
Also provide constructive feedback and improvement suggestions.`;

    const userPrompt = `Question: ${question}

Candidate's Answer: ${answer}

Please evaluate this answer and respond in JSON format with:
{
  "communication": <score 1-10>,
  "confidence": <score 1-10>,
  "grammar": <score 1-10>,
  "relevance": <score 1-10>,
  "summary": "<brief feedback>",
  "improvements": "<improvement suggestions>"
}`;

    console.log('Calling AI for evaluation...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI evaluation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');
    
    const content = aiData.choices[0].message.content;
    
    // Parse the JSON response from AI
    let feedback;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      feedback = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI response:', content);
      // Fallback feedback if parsing fails
      feedback = {
        communication: 7,
        confidence: 7,
        grammar: 7,
        relevance: 7,
        summary: 'Unable to parse detailed feedback. Your answer was received.',
        improvements: 'Continue practicing and refining your responses.'
      };
    }

    // Calculate overall score
    const score = Math.round(
      ((feedback.communication + feedback.confidence + feedback.grammar + feedback.relevance) / 40) * 100
    );

    return new Response(
      JSON.stringify({
        score,
        feedback
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in evaluate-answer function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during evaluation',
        score: 0,
        feedback: {
          communication: 0,
          confidence: 0,
          grammar: 0,
          relevance: 0,
          summary: 'Error occurred during evaluation',
          improvements: 'Please try again'
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});