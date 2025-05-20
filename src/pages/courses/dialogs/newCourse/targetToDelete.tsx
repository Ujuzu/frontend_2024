import { ICourseTargetGroupResponse } from "@/Interfaces/ITargetGroup";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import { courseTargetGroupService } from "@/service/courseTargetGroupService";

const TargetGroupsForm: React.FC<IFormStepProps> = ({ courseId }) => {
  const { token } = useAuth();
  const [targetGroups, setTargetGroups] = useState<ICourseTargetGroupResponse[]>([]);
  const [courseTargetGroups, setCourseTargetGroups] = useState<ICourseTargetGroupResponse[]>([]);
  const [newTargetGroup, setNewTargetGroup] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch global target groups and course-specific target groups
  useEffect(() => {
    const fetchTargetGroups = async () => {
      if (!token || !courseId) return;
      try {
        const allGroupsResponse = await courseTargetGroupService.getTargetGroups(token) || [];
        const courseGroupsResponse = await courseTargetGroupService.getCourseTargetGroups(token, courseId) || [];

console.log("TargetGroupsForm", "allGroupsResponse", allGroupsResponse, "courseGroupsResponse", courseGroupsResponse);

        setTargetGroups(allGroupsResponse.data); // All available target groups
        setCourseTargetGroups(courseGroupsResponse.data); // Groups already linked to this course
      } catch (error) {
        console.error("Error fetching target groups:", error);
        toast.error("Failed to load target groups.");
      }
    };
    fetchTargetGroups();
  }, [token, courseId]);

  // Handle selection of target groups for the course
  const handleSelectTargetGroup = (id: number) => {
    if (!courseTargetGroups.some((group) => group.id === id)) {
      setCourseTargetGroups([...courseTargetGroups, targetGroups.find((group) => group.id === id)!]);
      
      // Send request to add selected group to the course in Strapi
      courseTargetGroupService.linkTargetGroupToCourse(token, courseId, id)
        .then(() => toast.success("Target group added successfully!"))
        .catch((error: any) => {
          console.error("Error linking target group:", error);
          toast.error("Failed to link target group to course.");
        });
    }
  };

  // Handle creating a new target group and linking it to the course
const handleAddNewTargetGroup = async () => {
  if (!newTargetGroup.trim() || !token || !courseId) {
    toast.error("Course ID is required to add a target group.");
    return;
  }

  try {
    setLoading(true);
    const payload = {
      data: {
        target_group_name: newTargetGroup,
        courses: [courseId], // Ensure it's linked to the course
      },
    };

    const response = await courseTargetGroupService.createTargetGroup(token, payload);
    
    // 🔥 Ensure we get the correct object structure
    const newGroup = Array.isArray(response) ? response[0] : response;

    console.log("New target group created:", newGroup);

    setTargetGroups([...targetGroups, newGroup]); // ✅ Works correctly
    setCourseTargetGroups([...courseTargetGroups, newGroup]); // ✅ Works correctly

    setNewTargetGroup(""); // Clear input field
    toast.success("Target group added successfully!");
  } catch (error) {
    console.error("Error creating target group:", error);
    toast.error("Failed to add target group.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Target Groups</h2>

      {/* Show already linked target groups */}
      <div className="space-y-2">
        <Label>Target Groups Linked to This Course:</Label>
        <div className="border rounded-md p-2 bg-gray-100">
          {courseTargetGroups.length > 0 ? (
            courseTargetGroups.map((group) => (
              <p key={group.id} className="text-sm text-gray-800">
                • {group.attributes.target_group_name}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">No target groups linked yet.</p>
          )}
        </div>
      </div>

      {/* Select existing target groups */}
      <div className="space-y-2">
        <Label htmlFor="target-group-select">Select Target Groups</Label>
        <Select onValueChange={(value) => handleSelectTargetGroup(parseInt(value, 10))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose target groups" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(targetGroups) && targetGroups.map((group) => (
              <SelectItem key={group.id} value={group.id.toString()}>
                {group.attributes.target_group_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add new target group */}
      <div className="space-y-2">
        <Label htmlFor="new-target-group">Add New Target Group</Label>
        <Input
          id="new-target-group"
          value={newTargetGroup}
          onChange={(e) => setNewTargetGroup(e.target.value)}
          placeholder="Enter new target group name"
        />
        <Button
          onClick={handleAddNewTargetGroup}
          className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
          disabled={!newTargetGroup || loading}
        >
          {loading ? "Adding..." : "Add Target Group"}
        </Button>
      </div>
    </div>
  );
};

export default TargetGroupsForm;