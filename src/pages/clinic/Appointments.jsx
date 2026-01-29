import { DefaultPage } from "../../components/DefaultPage"
import { useTranslation } from "react-i18next";

export function ClinicAppointments() {
  const { t } = useTranslation();
  return <DefaultPage title={t("appointments.title")} />
}
