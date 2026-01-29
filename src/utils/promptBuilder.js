/**
 * Build veterinary diagnosis prompts in Arabic or English
 * @param {Object} examinationData - Complete examination form data
 * @param {string} language - Language code ('en' or 'ar')
 * @param {string} userMessage - Optional user message/question
 * @returns {string} Formatted prompt
 */
export const buildPrompt = (examinationData, language, userMessage = '') => {
  if (language === 'ar') {
    return buildArabicPrompt(examinationData, userMessage)
  } else {
    return buildEnglishPrompt(examinationData, userMessage)
  }
}

/**
 * Build Arabic veterinary prompt
 */
const buildArabicPrompt = (data, userMessage) => {
  const { basicInformation, visitInformation, reproductiveCycle, environment, diet, 
          vomiting, convulsions, cough, sneezing, urination, discharges, 
          otherConditions, clinicalExamination, previousConditions, protectiveAgents } = data

  let prompt = `أنت طبيب بيطري خبير. قم بتحليل البيانات التالية واقترح تشخيصاً محتملاً بناءً على الأعراض والفحوصات.

=== معلومات الحيوان الأساسية ===
`

  // Basic Information
  if (basicInformation) {
    if (basicInformation.animalType) prompt += `نوع الحيوان: ${basicInformation.animalType}\n`
    if (basicInformation.breed) prompt += `السلالة: ${basicInformation.breed}\n`
    if (basicInformation.gender) prompt += `الجنس: ${basicInformation.gender}\n`
    if (basicInformation.age) prompt += `العمر: ${basicInformation.age}\n`
    if (basicInformation.weight) prompt += `الوزن: ${basicInformation.weight} كغ\n`
    if (basicInformation.neutered !== undefined) prompt += `مخصي/معقم: ${basicInformation.neutered ? 'نعم' : 'لا'}\n`
  }

  // Visit Information
  if (visitInformation) {
    prompt += `\n=== معلومات الزيارة ===\n`
    if (visitInformation.chiefComplaint) prompt += `الشكوى الرئيسية: ${visitInformation.chiefComplaint}\n`
    if (visitInformation.durationOfComplaint) prompt += `مدة الشكوى: ${visitInformation.durationOfComplaint}\n`
    if (visitInformation.progressOfCondition) prompt += `تطور الحالة: ${visitInformation.progressOfCondition}\n`
  }

  // Clinical Examination
  if (clinicalExamination) {
    prompt += `\n=== الفحص الإكلينيكي ===\n`
    if (clinicalExamination.temperature) prompt += `درجة الحرارة: ${clinicalExamination.temperature}°C\n`
    if (clinicalExamination.heartRate) prompt += `معدل القلب: ${clinicalExamination.heartRate} نبضة/دقيقة\n`
    if (clinicalExamination.respiratoryRate) prompt += `معدل التنفس: ${clinicalExamination.respiratoryRate} نفس/دقيقة\n`
    if (clinicalExamination.hasDehydration) {
      prompt += `جفاف: نعم (${clinicalExamination.dehydrationPercentage}%)\n`
    }
    if (clinicalExamination.notes) prompt += `ملاحظات: ${clinicalExamination.notes}\n`
  }

  // User's specific question
  if (userMessage) {
    prompt += `\n=== سؤال الطبيب ===\n${userMessage}\n`
  }

  prompt += `\n=== المطلوب ===
قدم تشخيصاً بيطرياً مباشراً ومختصراً بناءً على البيانات أعلاه. 

**تعليمات مهمة:**
- ابدأ مباشرة بالتشخيص المحتمل بدون مقدمات أو اعتذارات
- إذا كانت البيانات محدودة، اقترح التشخيصات الأكثر احتمالاً بناءً على المعلومات المتاحة
- كن عملياً ومفيداً حتى مع البيانات الجزئية
- لكل تشخيص محتمل، اذكر أسبابه والفحوصات الموصى بها

يرجى الإجابة باللغة العربية بشكل مباشر ومهني. اذكر 3-5 تشخيصات محتملة.`

  return prompt
}

/**
 * Build English veterinary prompt
 */
const buildEnglishPrompt = (data, userMessage) => {
  const { basicInformation, visitInformation, reproductiveCycle, environment, diet, 
          vomiting, convulsions, cough, sneezing, urination, discharges, 
          otherConditions, clinicalExamination, previousConditions, protectiveAgents } = data

  let prompt = `You are an expert veterinarian. Analyze the following data and suggest possible diagnoses based on the symptoms and examinations.

=== Basic Animal Information ===
`

  // Basic Information
  if (basicInformation) {
    if (basicInformation.animalType) prompt += `Animal Type: ${basicInformation.animalType}\n`
    if (basicInformation.breed) prompt += `Breed: ${basicInformation.breed}\n`
    if (basicInformation.gender) prompt += `Gender: ${basicInformation.gender}\n`
    if (basicInformation.age) prompt += `Age: ${basicInformation.age}\n`
    if (basicInformation.weight) prompt += `Weight: ${basicInformation.weight} kg\n`
    if (basicInformation.neutered !== undefined) prompt += `Neutered/Spayed: ${basicInformation.neutered ? 'Yes' : 'No'}\n`
  }

  // Visit Information
  if (visitInformation) {
    prompt += `\n=== Visit Information ===\n`
    if (visitInformation.chiefComplaint) prompt += `Chief Complaint: ${visitInformation.chiefComplaint}\n`
    if (visitInformation.durationOfComplaint) prompt += `Duration: ${visitInformation.durationOfComplaint}\n`
    if (visitInformation.progressOfCondition) prompt += `Progress: ${visitInformation.progressOfCondition}\n`
  }

  // Clinical Examination
  if (clinicalExamination) {
    prompt += `\n=== Clinical Examination ===\n`
    if (clinicalExamination.temperature) prompt += `Temperature: ${clinicalExamination.temperature}°C\n`
    if (clinicalExamination.heartRate) prompt += `Heart Rate: ${clinicalExamination.heartRate} bpm\n`
    if (clinicalExamination.respiratoryRate) prompt += `Respiratory Rate: ${clinicalExamination.respiratoryRate} breaths/min\n`
    if (clinicalExamination.hasDehydration) {
      prompt += `Dehydration: Yes (${clinicalExamination.dehydrationPercentage}%)\n`
    }
    if (clinicalExamination.notes) prompt += `Notes: ${clinicalExamination.notes}\n`
  }

  // User's specific question
  if (userMessage) {
    prompt += `\n=== Veterinarian's Question ===\n${userMessage}\n`
  }

  prompt += `\n=== Required ===
Provide a direct and concise veterinary diagnosis based on the data above.

**Important Instructions:**
- Start directly with the possible diagnosis without introductions or apologies
- If data is limited, suggest the most likely diagnoses based on available information
- Be practical and helpful even with partial data
- For each possible diagnosis, mention its causes and recommended tests

Please answer in English in a direct and professional manner. Mention 3-5 possible diagnoses.`

  return prompt
}
