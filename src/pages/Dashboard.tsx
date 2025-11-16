import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Trophy, Target, TrendingUp, LogOut, Plus } from 'lucide-react';
import { companies } from '@/data/companies';

interface Interview {
  id: string;
  company: string;
  interview_type: string;
  overall_score: number | null;
  started_at: string;
  completed_at: string | null;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    completedInterviews: 0,
  });

  useEffect(() => {
    checkAuth();
    loadInterviews();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const loadInterviews = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;

      setInterviews(data || []);
      
      // Calculate stats
      const completed = data?.filter(i => i.status === 'completed') || [];
      const totalScore = completed.reduce((sum, i) => sum + (i.overall_score || 0), 0);
      
      setStats({
        totalInterviews: data?.length || 0,
        averageScore: completed.length > 0 ? totalScore / completed.length : 0,
        completedInterviews: completed.length,
      });
    } catch (error: any) {
      toast.error('Error loading interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const getCompanyEmoji = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.logo || '💼';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MockPro Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Track your interview performance and progress</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/progress')} variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Progress
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalInterviews}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {stats.averageScore.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedInterviews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Start New Interview */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle>Ready for your next interview?</CardTitle>
            <CardDescription>Choose a company and start practicing</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/interview/setup')} size="lg" className="w-full md:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              Start New Interview
            </Button>
          </CardContent>
        </Card>

        {/* Recent Interviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
            <CardDescription>Your interview history</CardDescription>
          </CardHeader>
          <CardContent>
            {interviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No interviews yet. Start your first one!
              </p>
            ) : (
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => interview.status === 'completed' && navigate(`/results/${interview.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <span className="text-3xl">{getCompanyEmoji(interview.company)}</span>
                      <div>
                        <p className="font-semibold capitalize">
                          {interview.company} - {interview.interview_type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(interview.started_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {interview.status === 'completed' && interview.overall_score && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {interview.overall_score.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        interview.status === 'completed'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-yellow-500/20 text-yellow-700'
                      }`}>
                        {interview.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;