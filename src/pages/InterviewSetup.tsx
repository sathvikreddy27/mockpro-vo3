import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Briefcase, MessageSquare } from 'lucide-react';
import { companies } from '@/data/companies';

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState<'technical' | 'hr' | ''>('');

  const handleStart = async () => {
    if (!selectedCompany || !selectedType) {
      toast.error('Please select both company and interview type');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('interviews')
        .insert({
          user_id: user.id,
          company: selectedCompany,
          interview_type: selectedType,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Interview started!');
      navigate(`/interview/${data.id}`);
    } catch (error: any) {
      toast.error('Error starting interview: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Setup Your Interview</CardTitle>
            <CardDescription>Choose a company and interview type to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Company Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Select Company
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {companies.map((company) => (
                  <Card
                    key={company.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCompany === company.id
                        ? 'ring-2 ring-primary shadow-md'
                        : ''
                    }`}
                    onClick={() => setSelectedCompany(company.id)}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <span className="text-4xl mb-2">{company.logo}</span>
                      <p className="font-semibold">{company.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Interview Type Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Interview Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedType === 'technical'
                      ? 'ring-2 ring-primary shadow-md'
                      : ''
                  }`}
                  onClick={() => setSelectedType('technical')}
                >
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2">Technical Interview</h4>
                    <p className="text-sm text-muted-foreground">
                      Coding, algorithms, system design, and technical concepts
                    </p>
                  </CardContent>
                </Card>
                
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedType === 'hr'
                      ? 'ring-2 ring-primary shadow-md'
                      : ''
                  }`}
                  onClick={() => setSelectedType('hr')}
                >
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2">HR Interview</h4>
                    <p className="text-sm text-muted-foreground">
                      Behavioral questions, culture fit, and soft skills
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStart}
              disabled={!selectedCompany || !selectedType || loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Starting Interview...
                </>
              ) : (
                'Start Interview'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewSetup;