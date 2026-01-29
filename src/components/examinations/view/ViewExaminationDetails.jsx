"use client"

import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { WithLoading } from "@/components/ui/WithLoading"
import { Button } from "@/components/ui/button"
import AddEditExaminationSkeleton from "@/components/Skeletons/animals/Examinations/AddEditExaminationSkeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useExamination, useMarkExaminationFullyPaid } from "@/hooks/queries/useExaminationQueries"
import { ExaminationFollowUpsTable } from "../followup/ExaminationFollowUpsTable"
import {
  User,
  FileText,
  Heart,
  Home,
  Utensils,
  Droplets,
  Zap,
  Wind,
  Flower,
  Droplet,
  Eye,
  AlertTriangle,
  History,
  Shield,
  Stethoscope,
  Pill,
} from "lucide-react"
 import { cn } from "@/utilities/cn"
import {
  ViewBasicInformationSection,
  ViewVisitInformationSection,
  ViewReproductiveCycleSection,
  ViewEnvironmentSection,
  ViewDietSection,
  ViewVomitingSection,
  ViewConvulsionsSection,
  ViewCoughSection,
  ViewSneezingSection,
  ViewUrinationSection,
  ViewDischargesSection,
  ViewOtherConditionsSection,
  ViewPreviousConditionsSection,
  ViewProtectiveAgentsSection,
  ViewDiagnosisSection,
  ViewTreatmentSection,
} from "./sections"

export function ViewExaminationDetails() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === "ar"
  const { examinationId } = useParams()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("basic")

  const FORM_SECTIONS = useMemo(
    () => [
      { id: "basic", title: t("examinations.basic.title"), icon: User, color: "bg-blue-500" },
      { id: "visit", title: t("examinations.visit.title"), icon: FileText, color: "bg-green-500" },
      { id: "reproductive", title: t("examinations.reproductive.title"), icon: Heart, color: "bg-pink-500" },
      { id: "environment", title: t("examinations.environment.title"), icon: Home, color: "bg-purple-500" },
      { id: "diet", title: t("examinations.diet.title"), icon: Utensils, color: "bg-orange-500" },
      { id: "vomiting", title: t("examinations.vomiting.title"), icon: Droplets, color: "bg-red-500" },
      { id: "convulsions", title: t("examinations.convulsions.title"), icon: Zap, color: "bg-yellow-500" },
      { id: "cough", title: t("examinations.cough.title"), icon: Wind, color: "bg-teal-500" },
      { id: "sneezing", title: t("examinations.sneezing.title"), icon: Flower, color: "bg-indigo-500" },
      { id: "urination", title: t("examinations.urination.title"), icon: Droplet, color: "bg-cyan-500" },
      { id: "discharges", title: t("examinations.discharges.title"), icon: Eye, color: "bg-amber-500" },
      { id: "other", title: t("examinations.other.title"), icon: AlertTriangle, color: "bg-rose-500" },
      { id: "previous", title: t("examinations.previous.title"), icon: History, color: "bg-slate-500" },
      {
        id: "protectiveAgents",
        title: t("examinations.protective_agents.title"),
        icon: Shield,
        color: "bg-emerald-500",
      },
      { id: "diagnosis", title: t("examinations.diagnosis.title"), icon: Stethoscope, color: "bg-violet-500" },
      { id: "treatment", title: t("examinations.treatment.title"), icon: Pill, color: "bg-lime-500" },
      { id: "followups", title: t("examinations.main.sections.followups"), icon: History, color: "bg-indigo-600" },
    ],
    [t],
  )

  const { data, isLoading } = useExamination(examinationId, { enabled: !!examinationId })
  const examination = data?.data
  const isFailure = data?.isFailure || !examination

  // Hook for marking examination as fully paid
  const markFullyPaidMutation = useMarkExaminationFullyPaid()

  const breadcrumbPage = t("examinations.main.view_breadcrumb")

  const sectionContent = useMemo(() => {
    switch (activeSection) {
      case "basic":
        return (
          <ViewBasicInformationSection
            data={{
              ...(examination?.basicInformation || {}),
              animalId: examination?.animalId,
              animalName: examination?.animalName,
              ownerName: examination?.ownerName,
              animalType: examination?.animalType,
              animalBreed: examination?.animalBreed,
              animalDateOfBirth: examination?.animalDateOfBirth,
              // for current UI fields expecting species
              species: examination?.animalType,
            }}
          />
        )
      case "visit":
        return <ViewVisitInformationSection data={examination?.visitInformation} />
      case "reproductive":
        return <ViewReproductiveCycleSection data={examination?.reproductiveCycle} />
      case "environment":
        return <ViewEnvironmentSection data={examination?.environment} />
      case "diet":
        return <ViewDietSection data={examination?.diet} />
      case "vomiting":
        return <ViewVomitingSection data={examination?.vomiting} />
      case "convulsions":
        return <ViewConvulsionsSection data={examination?.convulsions} />
      case "cough":
        return <ViewCoughSection data={examination?.cough} />
      case "sneezing":
        return <ViewSneezingSection data={examination?.sneezing} />
      case "urination":
        return <ViewUrinationSection data={examination?.urination} />
      case "discharges":
        return <ViewDischargesSection data={examination?.discharges} />
      case "other":
        return <ViewOtherConditionsSection data={examination?.otherConditions} />
      case "previous":
        return <ViewPreviousConditionsSection data={examination?.previousConditionsGrouped} />
      case "protectiveAgents":
        return <ViewProtectiveAgentsSection data={examination?.protectiveAgents} />
      case "diagnosis":
        return <ViewDiagnosisSection data={examination} />
      case "treatment":
        return <ViewTreatmentSection data={examination} /> // needs followUp fields too
      case "followups":
        return (
          <ExaminationFollowUpsTable
            examinationId={examination?.id}
            examinationDate={examination?.basicInformation?.date}
          />
        )
      default:
        return null
    }
  }, [activeSection, examination])

  if (!isLoading && isFailure) {
    return (
      <div className="p-6 dark:bg-zinc-900" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500 dark:text-red-400 mb-4">
              <Stethoscope className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {t("examinations.main.not_found")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t("examinations.main.not_found_desc")}</p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
              >
                {t("common.back")}
              </Button>
              <Button
                onClick={() => navigate("/clinic/animals/examinations")}
                className="dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                {t("examinations.main.back_to_list")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <WithLoading isLoading={isLoading} skeleton={<AddEditExaminationSkeleton />}>
      <div className="p-6 space-y-6 dark:bg-zinc-900" dir={isRTL ? "rtl" : "ltr"}>
        {/* Breadcrumb */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-primary-800 dark:text-primary-400">{breadcrumbPage}</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/warehouse/dashboard" className="dark:text-zinc-400 dark:hover:text-white">
                  {t("common.dashboard")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/clinic/animals/examinations"
                  className="dark:text-zinc-400 dark:hover:text-white"
                >
                  {t("examinations.main.title")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="dark:text-white">{breadcrumbPage}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Section selector (icon navigation) */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-zinc-950/50 p-4 sm:p-2 dark:border dark:border-zinc-800">
          <div className="flex flex-wrap justify-start gap-3 sm:gap-4">
            {FORM_SECTIONS.map((section) => {
              const IconComponent = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-2 sm:p-2 md:p-3 rounded-lg transition-all duration-200 hover:scale-105 w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] md:w-[100px] md:h-[100px]",
                    isActive
                      ? `${section.color} text-white shadow-lg dark:shadow-lg`
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700",
                  )}
                  title={section.title}
                >
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 flex-shrink-0",
                      isActive ? "bg-white/20" : "bg-white/50 dark:bg-zinc-700/50",
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5",
                        isActive ? "text-white" : "text-gray-600 dark:text-zinc-300",
                      )}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight break-words hyphens-auto px-1">
                    {section.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-zinc-950/50 p-6 min-h-[300px] dark:border dark:border-zinc-800">
          {sectionContent}
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
          >
            {t("common.back")}
          </Button>
        </div>
      </div>
    </WithLoading>
  )
}
