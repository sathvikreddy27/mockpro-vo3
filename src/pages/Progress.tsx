import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, TrendingUp, Award, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface Interview {
  id: string;
  company: string;
  interview_type: string;
  overall_score: number;
  completed_at: string;
}

const Progress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [companyStats, setCompanyStats] = useState<any[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('status', 'completed')
        .not('overall_score', 'is', null)
        .order('completed_at', { ascending: true });

      if (error) throw error;

      setInterviews(data || []);

      // Prepare chart data for progress over time
      const timelineData = (data || []).map((interview, index) => ({
        session: `#${index + 1}`,
        score: interview.overall_score,
        date: new Date(interview.completed_at).toLocaleDateString(),
      }));
      setChartData(timelineData);

      // Prepare company-wise stats
      const companyMap = new Map();
      (data || []).forEach(interview => {
        if (!companyMap.has(interview.company)) {
          companyMap.set(interview.company, { scores: [], count: 0 });
        }
        const stats = companyMap.get(interview.company);
        stats.scores.push(interview.overall_score);
        stats.count++;
      });

      const companyStatsData = Array.from(companyMap.entries()).map(([company, stats]) => ({
        company: company.charAt(0).toUpperCase() + company.slice(1),
        average: (stats.scores.reduce((a: number, b: number) => a + b, 0) / stats.count).toFixed(1),
        count: stats.count,
      }));
      setCompanyStats(companyStatsData);
    } catch (error: any) {
      toast.error('Error loading progress data');
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

  const latestScore = interviews.length > 0 ? interviews[interviews.length - 1].overall_score : 0;
  const averageScore = interviews.length > 0
    ? interviews.reduce((sum, i) => sum + i.overall_score, 0) / interviews.length
    : 0;
  const improvement = interviews.length >= 2
    ? interviews[interviews.length - 1].overall_score - interviews[0].overall_score
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Your Progress
          </h1>
          <p className="text-muted-foreground">Track your interview performance over time</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{latestScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Most recent interview</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Across all interviews</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${improvement >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Since first interview</p>
            </CardContent>
          </Card>
        </div>

        {interviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Complete your first interview to see your progress!
              </p>
              <Button onClick={() => navigate('/interview/setup')}>
                Start Your First Interview
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Progress Over Time Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Performance Timeline</CardTitle>
                <CardDescription>Your score progression across interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Company-wise Performance */}
            {companyStats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Company</CardTitle>
                  <CardDescription>Average scores for each company</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={companyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="company" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="average" fill="hsl(var(--primary))" name="Average Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;