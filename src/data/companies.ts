export interface Question {
  id: string;
  question: string;
  type: 'technical' | 'hr';
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Company {
  id: string;
  name: string;
  color: string;
  logo: string;
  questions: Question[];
}

export const companies: Company[] = [
  {
    id: 'google',
    name: 'Google',
    color: '#4285F4',
    logo: '🔵',
    questions: [
      {
        id: 'g-t-1',
        question: 'Explain the concept of polymorphism in object-oriented programming with a real-world example.',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'g-t-2',
        question: 'How would you design a scalable URL shortening service like bit.ly?',
        type: 'technical',
        difficulty: 'hard'
      },
      {
        id: 'g-t-3',
        question: 'What is the difference between SQL and NoSQL databases? When would you use each?',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'g-t-4',
        question: 'Explain how the Virtual DOM works in React and why it improves performance.',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'g-t-5',
        question: 'Describe the differences between HTTP and HTTPS. How does SSL/TLS work?',
        type: 'technical',
        difficulty: 'easy'
      },
      {
        id: 'g-h-1',
        question: 'Tell me about a time when you had to work with a difficult team member. How did you handle it?',
        type: 'hr',
      },
      {
        id: 'g-h-2',
        question: 'Why do you want to work at Google specifically?',
        type: 'hr',
      },
      {
        id: 'g-h-3',
        question: 'Describe a situation where you had to meet a tight deadline. How did you manage your time?',
        type: 'hr',
      },
      {
        id: 'g-h-4',
        question: 'What are your greatest strengths and how would they benefit our team?',
        type: 'hr',
      },
      {
        id: 'g-h-5',
        question: 'Where do you see yourself in 5 years?',
        type: 'hr',
      },
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    color: '#FF9900',
    logo: '📦',
    questions: [
      {
        id: 'a-t-1',
        question: 'How would you implement a least recently used (LRU) cache?',
        type: 'technical',
        difficulty: 'hard'
      },
      {
        id: 'a-t-2',
        question: 'Explain the differences between microservices and monolithic architecture.',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'a-t-3',
        question: 'What is Amazon\'s leadership principle "Customer Obsession"? How have you applied it?',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'a-t-4',
        question: 'How do you ensure code quality and maintainability in a large codebase?',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'a-t-5',
        question: 'Explain the concept of eventual consistency in distributed systems.',
        type: 'technical',
        difficulty: 'hard'
      },
      {
        id: 'a-h-1',
        question: 'Give me an example of a time when you took a calculated risk. What was the outcome?',
        type: 'hr',
      },
      {
        id: 'a-h-2',
        question: 'Tell me about a time when you had to make a decision with incomplete information.',
        type: 'hr',
      },
      {
        id: 'a-h-3',
        question: 'Describe a situation where you disagreed with your manager. How did you handle it?',
        type: 'hr',
      },
      {
        id: 'a-h-4',
        question: 'What motivates you to perform at your best?',
        type: 'hr',
      },
      {
        id: 'a-h-5',
        question: 'Tell me about your biggest professional failure and what you learned from it.',
        type: 'hr',
      },
    ]
  },
  {
    id: 'infosys',
    name: 'Infosys',
    color: '#007CC3',
    logo: '💼',
    questions: [
      {
        id: 'i-t-1',
        question: 'What are the four pillars of object-oriented programming?',
        type: 'technical',
        difficulty: 'easy'
      },
      {
        id: 'i-t-2',
        question: 'Explain the difference between abstract classes and interfaces in Java.',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'i-t-3',
        question: 'What is normalization in databases? Explain different normal forms.',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'i-t-4',
        question: 'How does exception handling work in your preferred programming language?',
        type: 'technical',
        difficulty: 'easy'
      },
      {
        id: 'i-t-5',
        question: 'What is the Software Development Life Cycle (SDLC)? Explain the different phases.',
        type: 'technical',
        difficulty: 'easy'
      },
      {
        id: 'i-h-1',
        question: 'Why do you want to join Infosys?',
        type: 'hr',
      },
      {
        id: 'i-h-2',
        question: 'Tell me about yourself and your background.',
        type: 'hr',
      },
      {
        id: 'i-h-3',
        question: 'How do you handle stress and pressure at work?',
        type: 'hr',
      },
      {
        id: 'i-h-4',
        question: 'Are you willing to relocate if required?',
        type: 'hr',
      },
      {
        id: 'i-h-5',
        question: 'What are your salary expectations?',
        type: 'hr',
      },
    ]
  },
  {
    id: 'wipro',
    name: 'Wipro',
    color: '#7B3294',
    logo: '⚡',
    questions: [
      {
        id: 'w-t-1',
        question: 'What is the difference between a stack and a queue? Provide use cases for each.',
        type: 'technical',
        difficulty: 'easy'
      },
      {
        id: 'w-t-2',
        question: 'Explain the concept of multithreading and its advantages.',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'w-t-3',
        question: 'What are RESTful APIs? How do they differ from SOAP APIs?',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'w-t-4',
        question: 'What is version control? Explain Git workflow with branching strategies.',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'w-t-5',
        question: 'How do you approach debugging a complex issue in production?',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        id: 'w-h-1',
        question: 'What do you know about Wipro and its services?',
        type: 'hr',
      },
      {
        id: 'w-h-2',
        question: 'How do you prioritize tasks when you have multiple deadlines?',
        type: 'hr',
      },
      {
        id: 'w-h-3',
        question: 'Tell me about a time when you had to learn a new technology quickly.',
        type: 'hr',
      },
      {
        id: 'w-h-4',
        question: 'What is your approach to teamwork and collaboration?',
        type: 'hr',
      },
      {
        id: 'w-h-5',
        question: 'How do you keep yourself updated with the latest technology trends?',
        type: 'hr',
      },
    ]
  }
];

export const getCompanyQuestions = (companyId: string, type: 'technical' | 'hr') => {
  const company = companies.find(c => c.id === companyId);
  if (!company) return [];
  return company.questions.filter(q => q.type === type);
};

export const getCompany = (companyId: string) => {
  return companies.find(c => c.id === companyId);
};