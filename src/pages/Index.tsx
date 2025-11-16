import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, TrendingUp, Award } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MockPro
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            AI-Powered Virtual Mock Interview Simulator
          </p>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Practice interviews with leading companies. Get instant AI feedback. Improve your performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Evaluation</h3>
            <p className="text-muted-foreground">
              Get instant feedback on communication, confidence, and relevance
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
            <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor your improvement over time with detailed analytics
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Company-Specific Questions</h3>
            <p className="text-muted-foreground">
              Practice with real questions from Google, Amazon, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
