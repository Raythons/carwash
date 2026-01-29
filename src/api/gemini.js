import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyB296j7Xb76503CWT4fYEslb9_1wXmufsc";

// Initialize with API version v1 instead of v1beta
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Test function to list available models
 * Call this in console: import { listAvailableModels } from './api/gemini.js'; listAvailableModels();
 */
export const listAvailableModels = async () => {
  try {
    console.log("🔍 Fetching available models...");
    const models = await genAI.listModels();
    console.log("✅ Available models:", models);
    return models;
  } catch (error) {
    console.error("❌ Error listing models:", error);
    console.error("This likely means your API key is invalid or doesn't have proper permissions");
    console.error("Create a new API key at: https://aistudio.google.com/app/apikey");
    throw error;
  }
};

/**
 * Generate diagnosis suggestion
 * @param {Object} examinationData - Complete examination form data
 * @param {string} userMessage - Optional user message/question
 * @returns {Promise<string>} Complete AI-generated diagnosis
 */
export const generateDiagnosisSuggestion = async (examinationData, userMessage = "") => {
  const generationConfig = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  try {
    console.log("🔄 Using model: gemini-2.5-flash");
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig
    });

    // Build prompt
    const prompt = buildVeterinaryPrompt(examinationData, userMessage);
    console.log("Prompt length:", prompt.length, "characters");

    console.log("Generating content...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    console.log("Raw response:", JSON.stringify(response, null, 2));
    
    // Extract text from response
    let text = "";
    
    // Method 1: Try candidates[0].content.parts
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      console.log("Candidate:", candidate);
      
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        text = candidate.content.parts.map(part => part.text || "").join("");
        console.log("Extracted from parts:", text.length, "characters");
      }
    }
    
    // Method 2: Try response.text() as fallback
    if (!text || text.length === 0) {
      try {
        text = response.text();
        console.log("Extracted from response.text():", text.length, "characters");
      } catch (e) {
        console.warn("response.text() failed:", e);
      }
    }
    
    if (!text || text.length === 0) {
      console.error("❌ No text could be extracted from response");
      throw new Error("لم يتم الحصول على رد م�� الذكاء الاصطناعي");
    }
    
    console.log("✅ Final text length:", text.length);
    console.log("Text preview:", text.substring(0, 300) + "...");
    
    return text;
    
  } catch (error) {
    console.error("❌ Error generating diagnosis:", error);
    throw new Error("فشل في الحصول على اقتراح التشخيص: " + (error.message || "خطأ غير معروف"));
  }
};

/**
 * Build a detailed veterinary prompt from examination data
 */
const buildVeterinaryPrompt = (data, userMessage) => {
  const { basicInformation, visitInformation, reproductiveCycle, environment, diet, 
          vomiting, convulsions, cough, sneezing, urination, discharges, 
          otherConditions, clinicalExamination, previousConditions, protectiveAgents } = data;

  let prompt = `أنت طبيب بيطري خبير. قم بتحليل البيانات التالية واقترح تشخيصاً محتملاً بناءً على الأعراض والفحوصات.

=== معلومات الحيوان الأساسية ===
`;

  // Basic Information
  if (basicInformation) {
    if (basicInformation.animalType) prompt += `نوع الحيوان: ${basicInformation.animalType}\n`;
    if (basicInformation.breed) prompt += `السلالة: ${basicInformation.breed}\n`;
    if (basicInformation.gender) prompt += `الجنس: ${basicInformation.gender}\n`;
    if (basicInformation.age) prompt += `العمر: ${basicInformation.age}\n`;
    if (basicInformation.weight) prompt += `الوزن: ${basicInformation.weight} كغ\n`;
    if (basicInformation.neutered !== undefined) prompt += `مخصي/معقم: ${basicInformation.neutered ? "نعم" : "لا"}\n`;
  }

  // Visit Information
  if (visitInformation) {
    prompt += `\n=== معلومات الزيارة ===\n`;
    if (visitInformation.chiefComplaint) prompt += `الشكوى الرئيسية: ${visitInformation.chiefComplaint}\n`;
    if (visitInformation.durationOfComplaint) prompt += `مدة الشكوى: ${visitInformation.durationOfComplaint}\n`;
    if (visitInformation.progressOfCondition) prompt += `تطور الحالة: ${visitInformation.progressOfCondition}\n`;
  }

  // Reproductive Cycle (if female and not neutered)
  if (reproductiveCycle && basicInformation?.gender === "أنثى" && !basicInformation?.neutered) {
    prompt += `\n=== الدورة التناسلية ===\n`;
    if (reproductiveCycle.lastHeatDate) prompt += `آخر دورة شبق: ${reproductiveCycle.lastHeatDate}\n`;
    if (reproductiveCycle.pregnant !== undefined) prompt += `حامل: ${reproductiveCycle.pregnant ? "نعم" : "لا"}\n`;
    if (reproductiveCycle.birthDate) prompt += `تاريخ الولادة: ${reproductiveCycle.birthDate}\n`;
  }

  // Environment
  if (environment) {
    prompt += `\n=== البيئة والتربية ===\n`;
    if (environment.housingType) prompt += `نوع السكن: ${environment.housingType}\n`;
    if (environment.otherAnimals !== undefined) prompt += `حيوانات أخرى: ${environment.otherAnimals ? "نعم" : "لا"}\n`;
  }

  // Diet
  if (diet) {
    prompt += `\n=== النمط الغذائي ===\n`;
    if (diet.foodType) prompt += `نوع الطعام: ${diet.foodType}\n`;
    if (diet.appetite) prompt += `الشهية: ${diet.appetite}\n`;
  }

  // Clinical Signs - Vomiting
  if (vomiting?.hasVomiting) {
    prompt += `\n=== التقيؤ ===\n`;
    prompt += `يوجد تقيؤ: نعم\n`;
    if (vomiting.frequency) prompt += `التكرار: ${vomiting.frequency}\n`;
    if (vomiting.timing) prompt += `التوقيت: ${vomiting.timing}\n`;
    if (vomiting.characteristics) prompt += `الخصائص: ${vomiting.characteristics}\n`;
  }

  // Convulsions
  if (convulsions?.hasConvulsions) {
    prompt += `\n=== الاختلاجات ===\n`;
    prompt += `يوجد اختلاجات: نعم\n`;
    if (convulsions.frequency) prompt += `التكرار: ${convulsions.frequency}\n`;
    if (convulsions.duration) prompt += `المدة: ${convulsions.duration}\n`;
  }

  // Cough
  if (cough?.hasCough) {
    prompt += `\n=== السعال ===\n`;
    prompt += `يوجد سعال: نعم\n`;
    if (cough.type) prompt += `النوع: ${cough.type}\n`;
    if (cough.frequency) prompt += `التكرار: ${cough.frequency}\n`;
  }

  // Sneezing
  if (sneezing?.hasSneezing) {
    prompt += `\n=== العطاس ===\n`;
    prompt += `يوجد عطاس: نعم\n`;
    if (sneezing.frequency) prompt += `التكرار: ${sneezing.frequency}\n`;
  }

  // Urination
  if (urination) {
    prompt += `\n=== التبول ===\n`;
    if (urination.frequency) prompt += `التكرار: ${urination.frequency}\n`;
    if (urination.color) prompt += `اللون: ${urination.color}\n`;
    if (urination.painDuringUrination !== undefined) prompt += `ألم أثناء التبول: ${urination.painDuringUrination ? "نعم" : "لا"}\n`;
  }

  // Discharges
  if (discharges) {
    prompt += `\n=== الإفرازات ===\n`;
    if (discharges.eyeDischarge !== undefined) prompt += `إفرازات عينية: ${discharges.eyeDischarge ? "نعم" : "لا"}\n`;
    if (discharges.nasalDischarge !== undefined) prompt += `إفرازات أنفية: ${discharges.nasalDischarge ? "نعم" : "لا"}\n`;
    if (discharges.vaginalDischarge !== undefined) prompt += `إفرازات مهبلية: ${discharges.vaginalDischarge ? "نعم" : "لا"}\n`;
  }

  // Other Conditions
  if (otherConditions) {
    prompt += `\n=== حالات أخرى ===\n`;
    if (otherConditions.diarrhea !== undefined) prompt += `إسهال: ${otherConditions.diarrhea ? "نعم" : "لا"}\n`;
    if (otherConditions.constipation !== undefined) prompt += `إمساك: ${otherConditions.constipation ? "نعم" : "لا"}\n`;
    if (otherConditions.skinLesions !== undefined) prompt += `آفات جلدية: ${otherConditions.skinLesions ? "نعم" : "لا"}\n`;
    if (otherConditions.itching !== undefined) prompt += `حكة: ${otherConditions.itching ? "نعم" : "لا"}\n`;
    if (otherConditions.hairLoss !== undefined) prompt += `تساقط الشعر: ${otherConditions.hairLoss ? "نعم" : "لا"}\n`;
  }

  // Clinical Examination
  if (clinicalExamination) {
    prompt += `\n=== الفحص الإكلينيكي ===\n`;
    if (clinicalExamination.temperature) prompt += `درجة الحرارة: ${clinicalExamination.temperature}°C\n`;
    if (clinicalExamination.heartRate) prompt += `معدل القلب: ${clinicalExamination.heartRate} نبضة/دقيقة\n`;
    if (clinicalExamination.respiratoryRate) prompt += `معدل التنفس: ${clinicalExamination.respiratoryRate} نفس/دقيقة\n`;
    if (clinicalExamination.hasDehydration) {
      prompt += `جفاف: نعم (${clinicalExamination.dehydrationPercentage}%)\n`;
    }
    if (clinicalExamination.mucousMembranes) prompt += `الأغشية المخاطية: ${clinicalExamination.mucousMembranes}\n`;
    if (clinicalExamination.petechialHemorrhage) prompt += `نزف حبري: ${clinicalExamination.petechialHemorrhage}\n`;
    if (clinicalExamination.lymphNodeEnlargement) prompt += `ضخامة العقد اللمفية: ${clinicalExamination.lymphNodeEnlargement}\n`;
    if (clinicalExamination.notes) prompt += `ملاحظات: ${clinicalExamination.notes}\n`;
  }

  // Previous Conditions
  if (previousConditions && previousConditions.length > 0) {
    prompt += `\n=== الحالات السابقة ===\n`;
    previousConditions.forEach((condition, index) => {
      prompt += `${index + 1}. ${condition.condition}`;
      if (condition.date) prompt += ` (${condition.date})`;
      prompt += `\n`;
    });
  }

  // Vaccines
  if (protectiveAgents) {
    if (protectiveAgents.vaccines && protectiveAgents.vaccines.length > 0) {
      prompt += `\n=== اللقاحات ===\n`;
      protectiveAgents.vaccines.forEach((vaccine, index) => {
        prompt += `${index + 1}. ${vaccine.name}`;
        if (vaccine.date) prompt += ` (${vaccine.date})`;
        prompt += `\n`;
      });
    }
  }

  // User's specific question or request
  if (userMessage) {
    prompt += `\n=== سؤال الطبيب ===\n${userMessage}\n`;
  }

  prompt += `\n=== المطلوب ===
قدم تشخيصاً بيطرياً مباشراً ومختصراً بناءً على البيانات أعلاه. 

**تعليمات مهمة:**
- ابدأ مباشرة بالتشخيص المحتمل بدون مقدمات أو اعتذارات
- إذا كانت البيانات محدودة، اقترح التشخيصات الأكثر احتمالاً بناءً على المعلومات المتاحة
- كن عملياً ومفيداً حتى مع البيانات الجزئية
- لكل تشخيص محتمل، اذكر أسبابه والفحوصات الموصى بها

**الصيغة المطلوبة:**

### التشخيص المحتمل 1: [اسم التشخيص]
**الأسباب المحتملة:**
- [السبب الأول]
- [السبب الثاني]

**الفحوصات الموصى بها:**
- [الفحص الأول]
- [الفحص الثاني]

---

### التشخيص المحتمل 2: [اسم التشخيص]
**الأسباب المحتملة:**
- [السبب الأول]
- [السبب الثاني]

**الفحوصات الموصى بها:**
- [الفحص الأول]
- [الفحص الثاني]

---

**ملاحظات عامة:**
[نصائح عملية للطبيب البيطري]

**ملاحظة مهمة:**
إذا كانت الأعراض تشير إلى احتمالية وجود أكثر من مرض في نفس الوقت (تشخيصات متزامنة)، يرجى ذكر ذلك بوضوح.

يرجى الإجابة باللغة العربية بشكل مباشر ومهني. اذكر 3-5 تشخيصات محتملة.`;

  return prompt;
};
