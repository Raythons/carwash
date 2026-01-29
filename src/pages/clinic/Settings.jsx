import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DefaultPage } from "../../components/DefaultPage";
import { useClinic } from "../../contexts/ClinicContext";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

export function ClinicSettings() {
  const {
    clinics,
    isLoading,
    selectedClinicId,
    defaultClinicId,
    selectClinic,
    setDefaultClinic,
  } = useClinic();

  const [draftDefaultId, setDraftDefaultId] = useState(defaultClinicId ? String(defaultClinicId) : "");

  const selectedClinic = useMemo(() => clinics?.find((c) => c.id === selectedClinicId), [clinics, selectedClinicId]);
  const defaultClinic = useMemo(() => clinics?.find((c) => c.id === defaultClinicId), [clinics, defaultClinicId]);

  const handleApplyDefault = () => {
    const id = draftDefaultId ? parseInt(draftDefaultId, 10) : null;
    setDefaultClinic(id);
  };

  const handleClearDefault = () => {
    setDraftDefaultId("");
    setDefaultClinic(null);
  };

  return (
   <AIPreferencesSettings />
  );
}
