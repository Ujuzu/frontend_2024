import { ICourseTargetGroupResponse } from "@/Interfaces/ITargetGroup";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import { courseTargetGroupService } from "@/service/courseTargetGroupService";
import { X } from "lucide-react";

const TargetGroupsForm: React.FC<IFormStepProps> = ({ courseId }) => {
  const { token } = useAuth();
  const [targetGroups, setTargetGroups] = useState<ICourseTargetGroupResponse[]>([]);
  const [courseTargetGroups, setCourseTargetGroups] = useState<ICourseTargetGroupResponse[]>([]);
  const [newTargetGroup, setNewTargetGroup] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  // console.log("TargetGroupsForm props", "course id :", courseId, "data :", formData);
  // Fetch global target groups and course-specific target groups
  useEffect(() => {
    const fetchTargetGroups = async () => {
      if (!token || !courseId) return;
      try {
        const allGroupsResponse = await courseTargetGroupService.getTargetGroups(token) || [];
        const courseGroupsResponse = await courseTargetGroupService.getCourseTargetGroups(token, courseId) || [];

        setTargetGroups(allGroupsResponse.data); // All available target groups
        setCourseTargetGroups(courseGroupsResponse.data); // Groups already linked to this course
      } catch (error) {
        console.error("Error fetching target groups:", error);
        toast.error("Failed to load target groups.");
      }
    };
    fetchTargetGroups();
  }, [token, courseId]);
const filteredTargetGroups = targetGroups
  .filter(group =>
    group.attributes.target_group_name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .slice(0, 5);
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
    if (!newTargetGroup || !token || !courseId) {
      toast.error("Course ID is required to add a target group.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        target_group_name: newTargetGroup,
        courses: [courseId],
      };
      const response = await courseTargetGroupService.createTargetGroup(token, payload);
      const newGroup = response;

      setTargetGroups([...targetGroups, newGroup]); 
      setCourseTargetGroups([...courseTargetGroups, newGroup]); 

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
    await courseTargetGroupService.unlinkTargetGroupFromCourse(token, courseId, id);
    setCourseTargetGroups(courseTargetGroups.filter(group => group.id !== id)); 
    toast.success("Target group removed successfully!");
  } catch (error) {
    console.error("Error unlinking target group:", error);
    toast.error("Failed to unlink target group.");
  }
};


  return (
<div className="space-y-6">
  <h2 className="text-xl font-semibold">Target Groups</h2>

  {/* Show already linked target groups */}
  <div className="space-y-2">
    <Label>Target Groups Linked to This Course:</Label>
    <div className="border rounded-md p-2 bg-gray-100 space-y-2 max-h-60 overflow-y-auto">
      {courseTargetGroups.length > 0 ? (
        courseTargetGroups.map((group) => (
          <div
            key={group.id}
            className="flex justify-between items-start gap-4 border p-3 rounded bg-white hover:bg-gray-50 transition cursor-pointer"
          >
            <span className="text-sm break-words max-w-[70%]">
              {group.attributes.target_group_name}
            </span>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleRemoveTargetGroup(group.id)}
              className="shrink-0 cursor-pointer hover:bg-red-100 transition"
            >
              <X />
            </Button>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">
          No target groups linked yet.
        </p>
      )}
    </div>
  </div>

  {/* Search and select */}
  <div className="space-y-2">
    <Label htmlFor="target-group-search">Search Target Groups</Label>
    <Input
      id="target-group-search"
      type="text"
      placeholder="Search target groups..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <div className="max-h-40 overflow-y-auto border p-2 rounded space-y-2">
      {filteredTargetGroups.map((group) => (
        <Button
          key={group.id}
          onClick={() => handleSelectTargetGroup(group.id)}
          className="w-full text-left truncate hover:bg-gray-100 hover:text-black cursor-pointer transition"
          title={group.attributes.target_group_name}
        >
          {group.attributes.target_group_name}
        </Button>
      ))}
    </div>
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
      className="bg-[#AC19AD] hover:bg-[#8A1489] text-white transition"
      disabled={!newTargetGroup || loading}
    >
      {loading ? "Adding..." : "Add Target Group"}
    </Button>
  </div>
</div>


  );
};

export default TargetGroupsForm;