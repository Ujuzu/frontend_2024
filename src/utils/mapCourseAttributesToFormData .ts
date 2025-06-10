import { ICourseAttributesDataPayload, ICourseResponse } from "@/Interfaces/ICourseRespone";
import { unwrapRelation } from "@/service/relationUnwrapper";

export const mapCourseAttributesToFormData = (course?: ICourseResponse): ICourseAttributesDataPayload => {

  if (!course)
     return {
     
          locale: "en",
          course_name: "",
          certificate: false,
          quizes: false,
          sort_order: 0,
          rating_count: 0,
          courses_instructors: [],
          course_target_groups: [],
          course_learn_lists: [],
          course_qualification_equirements: [],
          courses_features: [],
          courses_weekly_curricula: [],
          courses_categories: [],
          courses_subcategories: [],
          subscription_packages: [],
        
    };

  const attrbs = course.attributes;
  return {
    course_name: attrbs.course_name,
    short_desc: attrbs.short_desc,
    short_desc_2: attrbs.short_desc_2,
    short_desc_3: attrbs.short_desc_3,
    course_outline: attrbs.course_outline,
    rating_count: attrbs.rating_count,
    language: attrbs.language,
    certificate: attrbs.certificate,
    quizes: typeof attrbs.quizes === "boolean" ? attrbs.quizes : Boolean(attrbs.quizes),
    level: attrbs.level,
    sort_order: attrbs.sort_order,
    weekly_curriculum_intro: attrbs.weekly_curriculum_intro,
    duration: attrbs.duration,
    video_url: attrbs.video_url,
    locale: attrbs.locale || "en",
    course_intro_img: course.attributes.course_intro_img?.data?.id,

    // 🔹 Relational array fields last
    courses_instructors: unwrapRelation(attrbs.courses_instructors),
    course_target_groups: unwrapRelation(attrbs.course_target_groups),
    course_learn_lists: unwrapRelation(attrbs.course_learn_lists),
    course_qualification_equirements: unwrapRelation(attrbs.course_qualification_equirements),
    courses_features: unwrapRelation(attrbs.courses_features),
    courses_weekly_curricula: unwrapRelation(attrbs.courses_weekly_curricula),
    courses_categories: unwrapRelation(attrbs.courses_categories),
    courses_subcategories: unwrapRelation(attrbs.courses_subcategories),
    subscription_packages: unwrapRelation(attrbs.subscription_packages),
  };
};