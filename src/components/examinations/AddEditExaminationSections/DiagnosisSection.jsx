"use client"

import { useTranslation } from "react-i18next"
import { useState, useMemo, useEffect } from "react"
import {
  Stethoscope,
  FileText,
  Search,
  Microscope,
  TestTube,
  Droplets,
  Scissors,
  Eye,
  FlaskConical,
  Activity,
  Bot,
  Send,
  Sparkles,
  Loader2,
  Settings,
} from "lucide-react"
import { Textarea } from "../../ui/Textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "../../ui/Button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import { useClinic } from "../../../contexts/ClinicContext"
import { AIProviderFactory } from "../../../api/ai/AIProviderFactory"
import { AIService } from "../../../api/ai/AIService"
import { getOrganizationAIPreferences, getDecryptedApiKey, updateOrganizationAIPreferences } from "../../../api/aiPreferencesApi"

import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"

export function DiagnosisSection({ formData, register, errors, getFieldError, isFieldTouched, onChange }) {
  const { t, i18n } = useTranslation()
  const { selectedClinicId } = useClinic()
  const safeFormData = formData || {}
  const diagnosticToolsData = safeFormData.diagnosticTools || {}
  const diagnosisData = safeFormData.diagnosis || {}
  
  // AI Chat state
  const [userMessage, setUserMessage] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  
  // AI Provider state
  const [selectedProvider, setSelectedProvider] = useState("Gemini")
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash-exp")
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [availableModels, setAvailableModels] = useState([])
  
  // Load organization AI preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getOrganizationAIPreferences()
        if (prefs) {
          setSelectedProvider(prefs.preferredProvider || "Gemini")
          setSelectedModel(prefs.preferredModel || "gemini-2.0-flash-exp")
          
          // Load API key if exists
          if (prefs.hasApiKey) {
            const key = await getDecryptedApiKey()
            setApiKey(key || "")
          } else {
            setApiKey("")
          }
        }
      } catch (error) {
        console.error("Failed to load AI preferences:", error)
      }
    }
    
    if (selectedClinicId) {
      loadPreferences()
    }
  }, [selectedClinicId])
  
  // Update available models when provider changes
  useEffect(() => {
    const provider = AIProviderFactory.createProvider(selectedProvider)
    const models = provider.getSupportedModels()
    setAvailableModels(models)
    
    // Set first model as default if current model not in list
    if (models.length > 0 && !models.find(m => m.value === selectedModel)) {
      setSelectedModel(models[0].value)
    }
  }, [selectedProvider])

  const diagnosticTools = useMemo(
    () => [
      { key: "radiography", label: t("examinations.diagnosis.tools.radiography"), icon: Search },
      { key: "ultrasound", label: t("examinations.diagnosis.tools.ultrasound"), icon: Activity },
      { key: "labTests", label: t("examinations.diagnosis.tools.labTests"), icon: TestTube },
      { key: "bloodSmear", label: t("examinations.diagnosis.tools.bloodSmear"), icon: Droplets },
      { key: "vaginalSmear", label: t("examinations.diagnosis.tools.vaginalSmear"), icon: Microscope },
      { key: "biopsy", label: t("examinations.diagnosis.tools.biopsy"), icon: Scissors },
      { key: "skinScraping", label: t("examinations.diagnosis.tools.skinScraping"), icon: Eye },
      { key: "urineTest", label: t("examinations.diagnosis.tools.urineTest"), icon: FlaskConical },
      { key: "stoolSample", label: t("examinations.diagnosis.tools.stoolSample"), icon: TestTube },
    ],
    [t],
  )

  const handleToolChange = (toolKey, checked) => {
    onChange(`diagnosticTools.${toolKey}Used`, checked)
    if (!checked) {
      onChange(`diagnosticTools.${toolKey}Result`, "")
    }
  }

  const handleResultChange = (toolKey, value) => {
    onChange(`diagnosticTools.${toolKey}Result`, value)
  }

  const handleAIAssist = async () => {
    if (!formData) {
      toast.error(t("examinations.diagnosis.ai_messages.no_data"))
      return
    }

    setIsLoadingAI(true)
    setAiResponse("")

    try {
      // Create provider using factory
      const provider = AIProviderFactory.createProvider(selectedProvider)
      const aiService = new AIService(provider)
      
      // Get current language from i18next
      const language = i18n.language || 'ar'
      
      // Generate diagnosis
      const response = await aiService.generateDiagnosis(
        apiKey,
        selectedModel,
        formData,
        language,
        userMessage
      )

      if (response && response.length > 0) {
        setAiResponse(response)
        toast.success(t("examinations.diagnosis.ai_messages.success"))
      } else {
        toast.error(t("examinations.diagnosis.ai_messages.no_response"))
      }
    } catch (error) {
      console.error("AI Error:", error)
      toast.error(error.message || t("examinations.diagnosis.ai_messages.failure"))
    } finally {
      setIsLoadingAI(false)
    }
  }
  
  const handleSavePreferences = async () => {
    try {
      await updateOrganizationAIPreferences({
        preferredProvider: selectedProvider,
        preferredModel: selectedModel,
        apiKey: apiKey || undefined
      })
      toast.success(t("ai.settings.save_success"))
    } catch (error) {
      console.error("Failed to save preferences:", error)
      toast.error(t("ai.settings.save_error"))
    }
  }

  const insertAIResponse = () => {
    if (aiResponse) {
      const currentDDX = diagnosisData.differentialDiagnosis || ""
      const header = t("examinations.diagnosis.ai_messages.prompt_header")
      const newDDX = currentDDX ? `${currentDDX}\n\n${header}\n${aiResponse}` : `${header}\n${aiResponse}`
      onChange("diagnosis.differentialDiagnosis", newDDX)
      toast.success(t("examinations.diagnosis.ai_messages.added"))
      setShowAIChat(false)
      setAiResponse("")
      setUserMessage("")
    }
  }

  return (
    <FormSection title={t("examinations.diagnosis.title")} icon={Stethoscope}>
      <FormGrid>
        {/* Diagnostic Tools Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 mb-4 dark:shadow-blue-500/10">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t("examinations.diagnosis.tools_title")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {diagnosticTools.map(({ key, label, icon: Icon }) => {
                const isUsed = diagnosticToolsData[`${key}Used`] || false
                const result = diagnosticToolsData[`${key}Result`] || ""

                return (
                  <div
                    key={key}
                    className="bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-lg border dark:border-zinc-700 shadow-sm"
                  >
                    {/* Checkbox */}
                    <div className="flex items-start space-x-2 space-x-reverse mb-3">
                      <Checkbox
                        id={`${key}Used`}
                        checked={isUsed}
                        onCheckedChange={(checked) => handleToolChange(key, checked)}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <Label
                        htmlFor={`${key}Used`}
                        className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white cursor-pointer flex items-start gap-2 break-words leading-tight"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{label}</span>
                      </Label>
                    </div>

                    {/* Result field - shown when checked */}
                    {isUsed && (
                      <div>
                        <Label className="text-xs text-gray-600 dark:text-zinc-400 mb-1 block">
                          {t("examinations.diagnosis.result_label")}
                        </Label>
                        <Textarea
                          value={result}
                          onChange={(e) => handleResultChange(key, e.target.value)}
                          placeholder={t("examinations.diagnosis.placeholders.result", { tool: label })}
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-500/30 mb-4 dark:shadow-purple-500/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-purple-800 dark:text-purple-400 flex items-center gap-2">
                <Bot className="h-5 w-5 flex-shrink-0" />
                <span className="break-words">{t("examinations.diagnosis.ai_title")}</span>
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAIChat(!showAIChat)}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Sparkles className="h-4 w-4 flex-shrink-0" />
                {showAIChat ? t("examinations.diagnosis.ai_hide") : t("examinations.diagnosis.ai_show")}
              </Button>
            </div>

            {showAIChat && (
              <div className="space-y-4">
                {/* AI Configuration */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-purple-300 dark:border-purple-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <Label className="text-sm font-semibold text-purple-800 dark:text-purple-400">
                      {t("ai.settings.config_title")}
                    </Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Provider Selector */}
                    <div>
                      <Label className="text-xs text-gray-700 dark:text-zinc-300 mb-2 block">
                        {t("ai.settings.provider_label")}
                      </Label>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AIProviderFactory.getAvailableProviders().map((provider) => (
                            <SelectItem key={provider.value} value={provider.value}>
                              {provider.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Model Picker */}
                    <div>
                      <Label className="text-xs text-gray-700 dark:text-zinc-300 mb-2 block">
                        {t("ai.settings.model_label")}
                      </Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* API Key Input */}
                    <div className="md:col-span-2">
                      <Label className="text-xs text-gray-700 dark:text-zinc-300 mb-2 block">
                        {t("ai.settings.api_key_label")} <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={t("ai.settings.api_key_placeholder")}
                          className="flex-1 select-none"
                          style={{ userSelect: 'none' }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? t("common.hide") : t("common.show")}
                        </Button>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="md:col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSavePreferences}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t("ai.settings.save_org_button")}
                      </Button>
                    </div>
                  </div>
                </div>
                {/* User Input */}
                <div>
                  <Label className="text-xs sm:text-sm text-gray-700 dark:text-white mb-2 block">
                    {t("examinations.diagnosis.ai_question_label")}
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Textarea
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder={t("examinations.diagnosis.ai_placeholder")}
                      rows={2}
                      className="flex-1"
                      disabled={isLoadingAI}
                    />
                    <Button
                      type="button"
                      onClick={handleAIAssist}
                      disabled={isLoadingAI}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 w-full sm:w-auto"
                    >
                      {isLoadingAI ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 break-words">
                    {t("examinations.diagnosis.ai_tip")}
                  </p>
                </div>

                {/* AI Response */}
                {aiResponse && (
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-purple-300 dark:border-purple-500/30 shadow-sm dark:shadow-purple-500/10">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-semibold text-purple-800 dark:text-purple-400 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        {t("examinations.diagnosis.ai_suggestion_label")}
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={insertAIResponse}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs"
                      >
                        {t("examinations.diagnosis.ai_add_to_ddx")}
                      </Button>
                    </div>
                    <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none text-gray-700 dark:text-zinc-300 whitespace-pre-wrap p-3 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700">
                      {aiResponse}
                    </div>
                  </div>
                )}

                {isLoadingAI && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-zinc-400">
                        {t("examinations.diagnosis.ai_loading")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Differential Diagnosis */}
        <div className="md:col-span-2 lg:col-span-3">
          <FormFieldWrapper>
            <FormFieldHeader icon={FileText} label={t("examinations.diagnosis.ddx_label")} />
            <Textarea
              value={diagnosisData.differentialDiagnosis || ""}
              onChange={(e) => onChange("diagnosis.differentialDiagnosis", e.target.value)}
              placeholder={t("examinations.diagnosis.placeholders.ddx")}
              rows={3}
            />
          </FormFieldWrapper>
        </div>

        {/* Provisional Diagnosis */}
        <div className="md:col-span-2 lg:col-span-3">
          <FormFieldWrapper>
            <FormFieldHeader icon={FileText} label={t("examinations.diagnosis.provisional_label")} />
            <Textarea
              value={diagnosisData.provisionalDiagnosis || ""}
              onChange={(e) => onChange("diagnosis.provisionalDiagnosis", e.target.value)}
              placeholder={t("examinations.diagnosis.placeholders.provisional")}
              rows={3}
            />
          </FormFieldWrapper>
        </div>

        {/* Final Diagnosis */}
        <div className="md:col-span-2 lg:col-span-3">
          <FormFieldWrapper>
            <FormFieldHeader icon={Stethoscope} label={t("examinations.diagnosis.final_label")} />
            <Textarea
              value={diagnosisData.finalDiagnosis || ""}
              onChange={(e) => onChange("diagnosis.finalDiagnosis", e.target.value)}
              placeholder={t("examinations.diagnosis.placeholders.final")}
              rows={4}
            />
          </FormFieldWrapper>
        </div>

        {/* Final Diagnosis Comments */}
        <div className="md:col-span-2 lg:col-span-3">
          <FormFieldWrapper>
            <FormFieldHeader icon={FileText} label={t("examinations.diagnosis.final_comments_label")} />
            <Textarea
              value={diagnosisData.finalDiagnosisComments || ""}
              onChange={(e) => onChange("diagnosis.finalDiagnosisComments", e.target.value)}
              placeholder={t("examinations.diagnosis.placeholders.final_comments")}
              rows={3}
            />
          </FormFieldWrapper>
        </div>
      </FormGrid>
    </FormSection>
  )
}
