import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import { getCompanyQuestions } from '@/data/companies';

interface InterviewData {
  id: string;
  company: string;
  interview_type: string;
}

interface Answer {
  question: string;
  answer: string;
  feedback: any;
  score: number;
}

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    loadInterview();
  }, [id]);

  const loadInterview = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setInterview(data);
      
      // Load questions for this interview
      const companyQuestions = getCompanyQuestions(data.company, data.interview_type as 'technical' | 'hr');
      const questionTexts = companyQuestions.slice(0, 5).map(q => q.question);
      setQuestions(questionTexts);
    } catch (error: any) {
      toast.error('Error loading interview');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    setSubmitting(true);
    try {
      // Call AI evaluation edge function
      const { data: evaluationData, error: evalError } = await supabase.functions.invoke('evaluate-answer', {
        body: {
          question: questions[currentQuestionIndex],
          answer: currentAnswer,
          interviewType: interview?.interview_type || 'technical'
        }
      });

      if (evalError) throw evalError;

      // Save answer to database
      const { error: insertError } = await supabase
        .from('interview_answers')
        .insert({
          interview_id: id,
          question: questions[currentQuestionIndex],
          answer: currentAnswer,
          feedback: evaluationData.feedback,
          score: evaluationData.score
        });

      if (insertError) throw insertError;

      // Add to local answers
      const newAnswer: Answer = {
        question: questions[currentQuestionIndex],
        answer: currentAnswer,
        feedback: evaluationData.feedback,
        score: evaluationData.score
      };
      setAnswers([...answers, newAnswer]);

      toast.success('Answer submitted!');
      setCurrentAnswer('');

      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Complete the interview
        await completeInterview();
      }
    } catch (error: any) {
      toast.error('Error submitting answer: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const completeInterview = async () => {
    try {
      // Calculate overall score
      const totalScore = answers.reduce((sum, a) => sum + a.score, 0) + (submitting ? 0 : 0);
      const averageScore = (totalScore / questions.length) * 100;

      const { error } = await supabase
        .from('interviews')
        .update({
          status: 'completed',
          overall_score: averageScore,
          completed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Interview completed!');
      navigate(`/results/${id}`);
    } catch (error: any) {
      toast.error('Error completing interview');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              {interview.company} - {interview.interview_type}
            </h2>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Question {currentQuestionIndex + 1}</CardTitle>
            <CardDescription>Take your time and provide a detailed answer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-secondary/30 rounded-lg">
              <p className="text-lg">{questions[currentQuestionIndex]}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Answer</label>
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[200px] resize-none"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Provide a clear, detailed response. The AI will evaluate your communication, grammar, and relevance.
              </p>
            </div>

            <Button
              onClick={handleSubmitAnswer}
              disabled={submitting || !currentAnswer.trim()}
              size="lg"
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Evaluating Answer...
                </>
              ) : currentQuestionIndex === questions.length - 1 ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Submit & Finish Interview
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Answer
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Answered Questions Counter */}
        {answers.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                ✓ You've answered {answers.length} question{answers.length > 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Interview;