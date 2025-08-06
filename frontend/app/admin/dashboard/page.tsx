'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-provider';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feedback {
  _id: string;
  userId: string; // This will be just the ID, not populated user object
  planType: 'meal' | 'workout';
  planId: string;
  rating?: number;
  comments?: string;
  submittedAt: string;
}

export default function AdminFeedbackPage() {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api<Feedback[]>('/feedback', { token });
      setFeedbacks(data.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    } catch (error) {
      setFeedbacks([]);
      // toast.error is handled by api.ts
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-primary">User Feedback</h1>

      <Card className="bg-card shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">All Submitted Feedback</CardTitle>
          <CardDescription className="text-secondary">
            Review feedback provided by users on their plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbacks.length === 0 ? (
            <p className="text-center text-secondary py-4">No feedback submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent/50">
                    <TableHead className="text-primary">Date</TableHead>
                    <TableHead className="text-primary">User ID</TableHead>
                    <TableHead className="text-primary">Plan Type</TableHead>
                    <TableHead className="text-primary">Plan ID</TableHead>
                    <TableHead className="text-primary">Rating</TableHead>
                    <TableHead className="text-primary">Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback._id} className="hover:bg-accent/20 transition-colors duration-200">
                      <TableCell className="font-medium text-secondary">{new Date(feedback.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-secondary">{feedback.userId}</TableCell>
                      <TableCell className="text-secondary capitalize">{feedback.planType}</TableCell>
                      <TableCell className="text-secondary">{feedback.planId}</TableCell>
                      <TableCell className="text-secondary">
                        {feedback.rating ? (
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'h-4 w-4',
                                  star <= feedback.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                                )}
                              />
                            ))}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-secondary max-w-[300px] truncate">{feedback.comments || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
