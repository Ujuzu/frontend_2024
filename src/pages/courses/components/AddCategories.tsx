
import { Button } from "@/components/ui/button";
import { ICategorySelectorProps } from "@/Interfaces/ICourseCategory";
import { X } from "lucide-react";


const CategorySelector: React.FC<ICategorySelectorProps> = ({
  availableCategories,
  availableSubcategories,
  selectedCategories,
  selectedSubcategories,
  setSelectedCategories,
  setSelectedSubcategories,
}) => {
  
  // Handle Category Selection
  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategories([...selectedCategories, categoryId]);
  };

  // Handle Category Removal
  const handleRemoveCategory = (categoryId: number) => {
    setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
  };

  // Handle Subcategory Selection
  const handleSelectSubcategory = (subcategoryId: number) => {
    setSelectedSubcategories([...selectedSubcategories, subcategoryId]);
  };

  // Handle Subcategory Removal
  const handleRemoveSubcategory = (subcategoryId: number) => {
    setSelectedSubcategories(selectedSubcategories.filter(id => id !== subcategoryId));
  };

  return (
    <div className="flex gap-4">
      {/* Available Categories */}
      <div className="w-1/2 border p-4 rounded">
        <h3 className="font-semibold mb-2">Available Categories</h3>
        {availableCategories.filter(cat => !selectedCategories.includes(cat.id)).map((category) => (
          <Button key={category.id} onClick={() => handleSelectCategory(category.id)}>
            {category.title}
          </Button>
        ))}
      </div>

      {/* Selected Categories */}
      <div className="w-1/2 border p-4 rounded">
        <h3 className="font-semibold mb-2">Selected Categories</h3>
        {selectedCategories.map((categoryId) => {
          const category = availableCategories.find(cat => cat.id === categoryId);
          return category ? (
            <div key={categoryId} className="flex items-center gap-2">
              <span>{category.title}</span>
              <Button onClick={() => handleRemoveCategory(categoryId)} variant="destructive">
                <X size={16} />
              </Button>
            </div>
          ) : null;
        })}
      </div>

      {/* Available Subcategories */}
      <div className="w-1/2 border p-4 rounded">
        <h3 className="font-semibold mb-2">Available Subcategories</h3>
        {availableSubcategories.filter(sub => !selectedSubcategories.includes(sub.id)).map((subcategory) => (
          <Button key={subcategory.id} onClick={() => handleSelectSubcategory(subcategory.id)}>
            {subcategory.title}
          </Button>
        ))}
      </div>

      {/* Selected Subcategories */}
      <div className="w-1/2 border p-4 rounded">
        <h3 className="font-semibold mb-2">Selected Subcategories</h3>
        {selectedSubcategories.map((subcategoryId) => {
          const subcategory = availableSubcategories.find(sub => sub.id === subcategoryId);
          return subcategory ? (
            <div key={subcategoryId} className="flex items-center gap-2">
              <span>{subcategory.title}</span>
              <Button onClick={() => handleRemoveSubcategory(subcategoryId)} variant="destructive">
                <X size={16} />
              </Button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default CategorySelector;