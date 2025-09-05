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

  return {
    course_name: course.course_name,
    short_desc: course.short_desc,
    short_desc_2: course.short_desc_2,
    short_desc_3: course.short_desc_3,
    course_outline: course.course_outline,
    rating_count: course.rating_count,
    language: course.language,
    certificate: course.certificate,
    quizes: typeof course.quizes === "boolean" ? course.quizes : Boolean(course.quizes),
    level: course.level,
    sort_order: course.sort_order,
    weekly_curriculum_intro: course.weekly_curriculum_intro,
    duration: course.duration,
    video_url: course.video_url,
    locale: course.locale || "en",
    course_intro_img: course.course_intro_img?.id,

    // 🔹 Relational array fields last
    courses_instructors: unwrapRelation(course.courses_instructors),
    course_target_groups: unwrapRelation(course.course_target_groups),
    course_learn_lists: unwrapRelation(course.course_learn_lists),
    course_qualification_equirements: unwrapRelation(course.course_qualification_equirements),
    courses_features: unwrapRelation(course.courses_features),
    courses_weekly_curricula: unwrapRelation(course.courses_weekly_curricula),
    courses_categories: unwrapRelation(course.courses_categories),
    courses_subcategories: unwrapRelation(course.courses_subcategories),
    subscription_packages: unwrapRelation(course.subscription_packages),
  };
};