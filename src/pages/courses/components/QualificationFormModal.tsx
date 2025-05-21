import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { IQualificationReqAttributes, QualificationFormModalProps } from "@/Interfaces/IQualificationRequirement";


const QualificationFormModal: React.FC<QualificationFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IQualificationReqAttributes>({
    qualification_name: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.qualification_name.trim()) {
      toast.error("Qualification name is required.");
      return;
    }

    try {
      setLoading(true);
      await onSuccess(formData);
      onClose();
    } catch (error) {
      console.error("Error adding qualification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Qualification</DialogTitle>
        </DialogHeader>

        {/* Input Fields */}
        <div className="space-y-4">
          <Input name="qualification_name" placeholder="Qualification Name *" value={formData.qualification_name} onChange={handleInputChange} required />
          <Input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white transition" disabled={loading}>
          {loading ? "Adding..." : "Add Qualification"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default QualificationFormModal;