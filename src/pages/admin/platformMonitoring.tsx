import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";
import {
  AlertCircle,
  ChevronDown,
  FileText,
  Users,
  BookOpen,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  PenBox
} from "lucide-react";

// Sample data for the dashboard
const userGrowthData = [
  { name: "Jan", users: 150 },
  { name: "Feb", users: 220 },
  { name: "Mar", users: 240 },
  { name: "Apr", users: 280 },
  { name: "May", users: 250 },
  { name: "Jun", users: 240 },
];

const revenueData = [
  { date: "Nov 01", revenue: 12 },
  { date: "Nov 05", revenue: 15 },
  { date: "Nov 10", revenue: 10 },
  { date: "Nov 15", revenue: 18 },
  { date: "Nov 20", revenue: 12 },
  { date: "Nov 25", revenue: 20 },
  { date: "Nov 30", revenue: 15 },
  { date: "Dec 05", revenue: 10 },
  { date: "Dec 10", revenue: 16 },
  { date: "Dec 15", revenue: 8 },
  { date: "Dec 20", revenue: 17 },
];

const userActivityData = [
  { name: "Student", value: 35 },
  { name: "Instructor", value: 25 },
  { name: "Parent", value: 20 },
  { name: "School", value: 20 },
];

const COLORS = ["#0088FE", "#AC19AD", "#FF8042", "#000000"];

export default function PlatformMonitoring() {
  const [timeFrameActivity] = useState("This week");
  const [timeFrameGrowth] = useState("This week");
  const [timeFrameRevenue] = useState("This month");

  const handleCopyToExcel = (data: string) => {
    console.log(`Copying ${data} to Excel`);
    // Implement actual Excel export functionality here
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white text-gray-900 border-none shadow">
          <CardContent className="p-4 flex items-center">
            <div className="rounded-md bg-[#AC19AD] p-2 mr-4">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">957</div>
              <div className="text-xs text-gray-500">Student Queries</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white text-gray-900 border-none shadow">
          <CardContent className="p-4 flex items-center">
            <div className="rounded-md bg-[#AC19AD] p-2 mr-4">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">957</div>
              <div className="text-xs text-gray-500">Resolved Complaints</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white text-gray-900 border-none shadow">
          <CardContent className="p-4 flex items-center">
            <div className="rounded-md bg-[#AC19AD] p-2 mr-4">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">1,674,767</div>
              <div className="text-xs text-gray-500">Student Visitors</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white text-gray-900 border-none shadow">
          <CardContent className="p-4 flex items-center">
            <div className="rounded-md bg-[#AC19AD] p-2 mr-4">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">951</div>
              <div className="text-xs text-gray-500">Completed Courses</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white text-gray-900 border-none shadow">
          <CardContent className="p-4 flex items-center">
            <div className="rounded-md bg-[#AC19AD] p-2 mr-4">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">345</div>
              <div className="text-xs text-gray-500">Active Courses</div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complaints card - Changed to white background */}
        <Card className="bg-white text-gray-900 border-none shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-200">
            <CardTitle className="text-md font-medium">Complaints</CardTitle>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">{timeFrameActivity}</span>
              <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-md p-4 flex items-center">
                <div className="rounded-md bg-[#AC19AD] p-2 mr-4">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">50</div>
                  <div className="text-xs text-gray-500">Solved</div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center">
                <div className="rounded-md bg-[#AC19AD] p-2 mr-4">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">50</div>
                  <div className="text-xs text-gray-500">Open</div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center">
                <div className="rounded-md bg-[#AC19AD] p-2 mr-4">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">50</div>
                  <div className="text-xs text-gray-500">New</div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center">
                <div className="rounded-md bg-[#AC19AD] p-2 mr-4">
                  <PenBox className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">160</div>
                  <div className="text-xs text-gray-500">Total Received</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* User Activity chart */}
        <Card className="bg-white text-gray-900 border-none shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-200">
            <CardTitle className="text-md font-medium">User Activity</CardTitle>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">{timeFrameActivity}</span>
              <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userActivityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userActivityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* User growth chart */}
        <Card className="bg-white text-gray-900 border-none shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-200">
            <CardTitle className="text-md font-medium">User Growth</CardTitle>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">{timeFrameGrowth}</span>
                <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => handleCopyToExcel("user growth data")}
              >
                Copy data to Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }} />
                  <Line type="monotone" dataKey="users" stroke="#AC19AD" strokeWidth={2} dot={{ fill: "#AC19AD", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Revenue chart */}
        <Card className="bg-white text-gray-900 border-none shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-200">
            <CardTitle className="text-md font-medium">Revenue</CardTitle>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">{timeFrameRevenue}</span>
                <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => handleCopyToExcel("revenue data")}
              >
                Copy data to Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 relative">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }} />
                  <Line type="monotone" dataKey="revenue" stroke="#AC19AD" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Annotation tooltip */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-md p-2 shadow-lg text-white">
                <div className="text-xs font-semibold">$1,789</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
