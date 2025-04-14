import React from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SubscriptionManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard size={24} className="text-[#AC19AD]" />
        <h1 className="text-2xl font-bold">Subscription Management</h1>
      </div>

      <Card className="bg-[#0f1724] border border-[#1a2333] shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <div className="bg-[#171f2e] p-4 rounded-full mb-4">
            <AlertCircle size={48} className="text-[#AC19AD]" />
          </div>
          <h2 className="text-xl font-semibold mb-3 text-white">Coming Soon</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            Subscription management features are currently under development. You'll be able to manage pricing plans, track subscriptions, and view payment analytics here.
          </p>
          <Button 
            className="bg-[#AC19AD] hover:bg-[#8e16a1] text-white border-none"
            disabled
          >
            Available in Next Release
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
