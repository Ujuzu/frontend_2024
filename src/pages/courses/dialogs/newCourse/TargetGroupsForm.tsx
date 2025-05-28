import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, Plus, Loader2, Target, CheckCircle } from "lucide-react";
import { courseTargetGroupService } from "@/service/courseTargetGroupService";
import { ICourseTargetGroupResponse } from "@/Interfaces/ITargetGroup";

const TargetGroupsForm: React.FC<IFormStepProps> = ({ courseId }) => {
  const { token } = useAuth();
  const [targetGroups, setTargetGroups] = useState<ICourseTargetGroupResponse[]>([]);
  const [courseTargetGroups, setCourseTargetGroups] = useState<ICourseTargetGroupResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTargetGroup, setNewTargetGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingTargetGroup, setAddingTargetGroup] = useState<number | null>(null);
  const [removingTargetGroup, setRemovingTargetGroup] = useState<number | null>(null);

  // Fetch global target groups and course-specific target groups
  useEffect(() => {
    const fetchTargetGroups = async () => {
      if (!token || !courseId) return;
      
      try {
        setInitialLoading(true);
        const [allGroupsResponse, courseGroupsResponse] = await Promise.all([
          courseTargetGroupService.getTargetGroups(token),
          courseTargetGroupService.getCourseTargetGroups(token, courseId)
        ]);
        
        setTargetGroups(allGroupsResponse?.data || []);
        setCourseTargetGroups(courseGroupsResponse?.data || []);
      } catch (error) {
        console.error("Error fetching target groups:", error);
        toast.error("Failed to load target groups.");
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchTargetGroups();
  }, [token, courseId]);

  const filteredTargetGroups = targetGroups
    .filter(group =>
      group.attributes.target_group_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !courseTargetGroups.some(courseGroup => courseGroup.id === group.id)
    )
    .slice(0, 5);

  // Simulate search loading when typing
  useEffect(() => {
    if (searchTerm.trim()) {
      setSearchLoading(true);
      const timer = setTimeout(() => setSearchLoading(false), 300);
      return () => clearTimeout(timer);
    } else {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  // Handle selection of target groups for the course
  const handleSelectTargetGroup = async (id: number) => {
    if (courseTargetGroups.some((group) => group.id === id)) return;
    
    try {
      setAddingTargetGroup(id);
      const selectedGroup = targetGroups.find((group) => group.id === id)!;
      setCourseTargetGroups([...courseTargetGroups, selectedGroup]);
      
      await courseTargetGroupService.linkTargetGroupToCourse(token, courseId, id);
      toast.success("Target group added successfully!");
    } catch (error) {
      console.error("Error linking target group:", error);
      setCourseTargetGroups(courseTargetGroups.filter(group => group.id !== id));
      toast.error("Failed to link target group to course.");
    } finally {
      setAddingTargetGroup(null);
    }
  };

  // Handle creating a new target group and linking it to the course
  const handleAddNewTargetGroup = async () => {
    if (!newTargetGroup.trim() || !token || !courseId) {
      toast.error("Target group name, Course ID and token are required to add a target group.");
      return;
    }
    
    try {
      setLoading(true);
      const payload = {
        target_group_name: newTargetGroup,
        courses: [courseId],
      };
      const response = await courseTargetGroupService.createTargetGroup(token, payload);
      
      setTargetGroups([...targetGroups, response]);
      setCourseTargetGroups([...courseTargetGroups, response]);
      setNewTargetGroup("");
      toast.success("Target group added successfully!");
    } catch (error) {
      console.error("Error creating target group:", error);
      toast.error("Failed to add target group.");
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a target group from the course
  const handleRemoveTargetGroup = async (id: number) => {
    try {
      setRemovingTargetGroup(id);
      await courseTargetGroupService.unlinkTargetGroupFromCourse(token, courseId, id);
      setCourseTargetGroups(courseTargetGroups.filter((group) => group.id !== id));
      toast.success("Target group removed successfully!");
    } catch (error) {
      console.error("Error unlinking target group:", error);
      toast.error("Failed to unlink target group.");
    } finally {
      setRemovingTargetGroup(null);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Target Groups</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-gray-600 font-medium">Loading target groups...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <Target className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Target Groups</h2>
      </div>

      {/* Current Target Groups */}
      <div className="space-y-3">
        <Label className="text-gray-700 font-medium">Target Groups Linked to This Course:</Label>
        <div className="border rounded-lg p-4 bg-gray-50 space-y-3 max-h-60 overflow-y-auto">
          {courseTargetGroups.length > 0 ? (
            courseTargetGroups.map((group) => (
              <div
                key={group.id}
                className="flex justify-between items-start gap-4 border border-gray-200 p-4 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm break-words max-w-[70%] text-gray-900 font-medium">
                    {group.attributes.target_group_name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveTargetGroup(group.id)}
                  className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                  disabled={removingTargetGroup === group.id}
                >
                  {removingTargetGroup === group.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No target groups linked yet.</p>
              <p className="text-xs text-gray-500 mt-1">Search and add target groups below</p>
            </div>
          )}
        </div>
      </div>

      {/* Search and Select */}
      <div className="space-y-3">
        <Label htmlFor="target-group-search" className="text-gray-700 font-medium">
          Available Target Groups
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="target-group-search"
            type="text"
            placeholder="Search target groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        
        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg bg-white">
          {searchLoading ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <p className="text-sm text-gray-600">Loading target groups...</p>
              </div>
            </div>
          ) : filteredTargetGroups.length > 0 ? (
            <div className="p-2 space-y-2">
              {filteredTargetGroups.map((group) => (
                <Button
                  key={group.id}
                  onClick={() => handleSelectTargetGroup(group.id)}
                  variant="ghost"
                  className="w-full text-left justify-start p-3 hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 border border-transparent hover:border-purple-200 rounded-md"
                  title={group.attributes.target_group_name}
                  disabled={addingTargetGroup === group.id}
                >
                  {addingTargetGroup === group.id ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span className="text-purple-600">Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="truncate text-gray-700">{group.attributes.target_group_name}</span>
                    </div>
                  )}
                </Button>
              ))}
              {targetGroups.filter(group => 
                group.attributes.target_group_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !courseTargetGroups.some(courseGroup => courseGroup.id === group.id)
              ).length > 5 && (
                <div className="p-2 text-center text-xs text-gray-500 border-t">
                  Showing first 5 results. Use search to find more specific target groups.
                </div>
              )}
            </div>
          ) : targetGroups.length === 0 ? (
            <div className="p-6 text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No target groups available</p>
              <p className="text-xs text-gray-500 mt-1">Create a new target group using the form below</p>
            </div>
          ) : courseTargetGroups.length === targetGroups.length ? (
            <div className="p-6 text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">All target groups are already linked</p>
              <p className="text-xs text-gray-500 mt-1">Create a new target group using the form below</p>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No target groups match your search
            </div>
          )}
        </div>
      </div>

      {/* Add New Target Group */}
      <div className="border-t border-gray-200 pt-6 space-y-3">
        <Label htmlFor="new-target-group" className="text-gray-700 font-medium">
          Add New Target Group
        </Label>
        <div className="flex space-x-3">
          <Input
            id="new-target-group"
            value={newTargetGroup}
            onChange={(e) => setNewTargetGroup(e.target.value)}
            placeholder="Enter new target group name"
            className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTargetGroup.trim()) {
                handleAddNewTargetGroup();
              }
            }}
          />
          <Button
            onClick={handleAddNewTargetGroup}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 transition-all duration-200 shadow-md hover:shadow-lg"
            disabled={!newTargetGroup.trim() || loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Adding...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Group</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TargetGroupsForm;
