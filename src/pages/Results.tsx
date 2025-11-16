import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Home, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { getCompany } from '@/data/companies';

interface Answer {
  question: string;
  answer: string;
  feedback: any;
  score: number;
}

interface InterviewResult {
  company: string;
  interview_type: string;
  overall_score: number;
  started_at: string;
  completed_at: string;
}

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<InterviewResult | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    loadResults();
  }, [id]);

  const loadResults = async () => {
    try {
      // Load interview
      const { data: interviewData, error: interviewError } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (interviewError) throw interviewError;
      setInterview(interviewData);

      // Load answers
      const { data: answersData, error: answersError } = await supabase
        .from('interview_answers')
        .select('*')
        .eq('interview_id', id)
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;
      setAnswers(answersData || []);
    } catch (error: any) {
      toast.error('Error loading results');
      navigate('/dashboard');
    } finally {
      setLoading(false);
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

  const company = getCompany(interview.company);
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-primary';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 max-w-5xl">
        <div className="flex gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate('/progress')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Progress
          </Button>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 shadow-lg border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl">{company?.logo || '💼'}</span>
            </div>
            <CardTitle className="text-3xl">Interview Complete!</CardTitle>
            <CardDescription className="text-lg">
              {company?.name} - {interview.interview_type}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
              <p className={`text-6xl font-bold ${getScoreColor(interview.overall_score)}`}>
                {interview.overall_score.toFixed(1)}%
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-2xl font-semibold">{answers.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-semibold">
                  {Math.round(
                    (new Date(interview.completed_at).getTime() -
                      new Date(interview.started_at).getTime()) /
                      60000
                  )}{' '}
                  min
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-2xl font-semibold">
                  {(answers.reduce((sum, a) => sum + a.score, 0) / answers.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Feedback</CardTitle>
            <CardDescription>AI evaluation for each question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {answers.map((answer, index) => (
              <div key={index} className="border-b last:border-b-0 pb-6 last:pb-0">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    Question {index + 1}
                    {answer.score >= 80 ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : answer.score < 60 ? (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    ) : null}
                  </h4>
                  <span className={`text-xl font-bold ${getScoreColor(answer.score)}`}>
                    {answer.score}/100
                  </span>
                </div>
                
                <p className="text-muted-foreground mb-3">{answer.question}</p>
                
                <div className="bg-secondary/30 p-4 rounded-lg mb-3">
                  <p className="text-sm font-medium mb-1">Your Answer:</p>
                  <p className="text-sm">{answer.answer}</p>
                </div>
                
                {answer.feedback && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {answer.feedback.communication && (
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Communication</p>
                          <p className="font-semibold">{answer.feedback.communication}/10</p>
                        </div>
                      )}
                      {answer.feedback.confidence && (
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Confidence</p>
                          <p className="font-semibold">{answer.feedback.confidence}/10</p>
                        </div>
                      )}
                      {answer.feedback.grammar && (
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Grammar</p>
                          <p className="font-semibold">{answer.feedback.grammar}/10</p>
                        </div>
                      )}
                      {answer.feedback.relevance && (
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Relevance</p>
                          <p className="font-semibold">{answer.feedback.relevance}/10</p>
                        </div>
                      )}
                    </div>
                    {answer.feedback.summary && (
                      <div className="bg-accent/10 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-1">AI Feedback:</p>
                        <p className="text-sm">{answer.feedback.summary}</p>
                      </div>
                    )}
                    {answer.feedback.improvements && (
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-1">Improvement Suggestions:</p>
                        <p className="text-sm">{answer.feedback.improvements}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button onClick={() => navigate('/interview/setup')} size="lg" className="flex-1">
            Take Another Interview
          </Button>
          <Button onClick={() => navigate('/dashboard')} variant="outline" size="lg" className="flex-1">
            <Home className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;