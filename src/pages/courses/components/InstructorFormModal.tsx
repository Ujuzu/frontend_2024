import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { InstructorFormModalProps } from "@/Interfaces/ICourseInstructor";



const InstructorFormModal: React.FC<InstructorFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
        instructor_name: "",
        instructor_title: "",
        instructor_desc: "",
        instructor_linkedIn: "",
        instructor_x: "",
        instructor_fb: "",
        instructor_youtube: "",
        instructor_email: "",
    });

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
  

const handleSubmit = async () => {
  if (!formData.instructor_name.trim()) {
    toast.error("Instructor name is required.");
    return;
  }

  await onSuccess(formData); 
  onClose(); // Closes the modal after submission
}


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Instructor</DialogTitle>
        </DialogHeader>

        {/* Input Fields */}
        <div className="space-y-4">
          <Input 
  name="instructor_name"
  placeholder="Instructor Name *"
  value={formData.instructor_name}
  onChange={handleInputChange}
  required
/>
<Input 
  name="instructor_title"
  placeholder="Instructor Title"
  value={formData.instructor_title}
  onChange={handleInputChange}
/>
<Input 
  name="instructor_desc"
  placeholder="Description"
  value={formData.instructor_desc}
  onChange={handleInputChange}
/>
<Input 
  name="instructor_linkedIn"
  placeholder="LinkedIn Profile"
  value={formData.instructor_linkedIn}
  onChange={handleInputChange}
/>
<Input 
  name="instructor_x"
  placeholder="X (Twitter) Profile"
  value={formData.instructor_x}
  onChange={handleInputChange}
/>
<Input 
  name="instructor_fb"
  placeholder="Facebook Profile"
  value={formData.instructor_fb}
  onChange={handleInputChange}
/>
<Input 
  name="instructor_youtube"
  placeholder="YouTube Channel"
  value={formData.instructor_youtube}
  onChange={handleInputChange}
/>
<Input 
  name="instructor_email"
  type="email"
  placeholder="Email"
  value={formData.instructor_email}
  onChange={handleInputChange}
/>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white transition" >
          {`Adding... `}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorFormModal;