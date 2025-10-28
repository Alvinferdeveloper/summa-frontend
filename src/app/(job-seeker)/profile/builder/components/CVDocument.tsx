"use client"

import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer"
import type { ProfileData } from "../../hooks/useMyProfile"

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf",
      fontWeight: 700,
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu51xIIzc.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TzBic6CsI.ttf",
      fontWeight: 700,
      fontStyle: "italic",
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Roboto",
  },
  // Header section con información de contacto
  headerSection: {
    marginBottom: 20,
    borderBottom: "2pt solid #2C3E50",
    paddingBottom: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    color: "#2C3E50",
    marginBottom: 8,
    textAlign: "center",
  },
  contactInfo: {
    fontSize: 10,
    color: "#555",
    textAlign: "center",
    marginBottom: 3,
  },
  // Secciones del CV
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#2C3E50",
    marginBottom: 8,
    borderBottom: "1pt solid #BDC3C7",
    paddingBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Personal statement
  personalStatement: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: "justify",
    color: "#333",
  },
  // Items de experiencia y educación
  entryContainer: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#2C3E50",
  },
  entryDate: {
    fontSize: 9,
    color: "#7F8C8D",
    fontStyle: "italic",
  },
  entrySubtitle: {
    fontSize: 10,
    color: "#555",
    marginBottom: 3,
  },
  entryDescription: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#333",
    textAlign: "justify",
  },
  // Skills
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillItem: {
    fontSize: 10,
    backgroundColor: "#ECF0F1",
    padding: "4 8",
    borderRadius: 3,
    color: "#2C3E50",
  },
  accessibilityContainer: {
    marginBottom: 10,
  },
  accessibilityItem: {
    fontSize: 10,
    color: "#333",
    marginBottom: 3,
    paddingLeft: 10,
  },
  disabilityItem: {
    fontSize: 10,
    color: "#333",
    marginBottom: 5,
    paddingLeft: 10,
  },
  disabilityDescription: {
    fontSize: 9,
    color: "#555",
    paddingLeft: 20,
    fontStyle: "italic",
  },
})

interface CVDocumentProps {
  profile: ProfileData
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Presente"
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
}

export const CVDocument = ({ profile }: CVDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.name}>
          {profile.first_name} {profile.last_name}
        </Text>
        {profile.city && profile.country && (
          <Text style={styles.contactInfo}>
            {profile.city}, {profile.country}
          </Text>
        )}
        {profile.email && <Text style={styles.contactInfo}>Email: {profile.email}</Text>}
        {profile.phone_number && <Text style={styles.contactInfo}>Teléfono: {profile.phone_number}</Text>}
        {profile.linked_in && <Text style={styles.contactInfo}>LinkedIn: {profile.linked_in}</Text>}
      </View>

      {profile.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil Profesional</Text>
          <Text style={styles.personalStatement}>{profile.description}</Text>
        </View>
      )}

      {profile.educations && profile.educations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación</Text>
          {profile.educations
            .sort((a, b) => {
              const dateA = a.start_date ? new Date(a.start_date).getTime() : 0
              const dateB = b.start_date ? new Date(b.start_date).getTime() : 0
              return dateB - dateA
            })
            .map((edu) => (
              <View key={edu.id} style={styles.entryContainer}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.degree}</Text>
                  <Text style={styles.entryDate}>
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {edu.field_of_study}
                  {edu.university?.name && ` • ${edu.university.name}`}
                </Text>
              </View>
            ))}
        </View>
      )}

      {profile.experiences && profile.experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
          {profile.experiences
            .sort((a, b) => {
              const dateA = a.start_date ? new Date(a.start_date).getTime() : 0
              const dateB = b.start_date ? new Date(b.start_date).getTime() : 0
              return dateB - dateA
            })
            .map((exp) => (
              <View key={exp.id} style={styles.entryContainer}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.job_title}</Text>
                  <Text style={styles.entryDate}>
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </Text>
                </View>
                {exp.employer?.company_name && <Text style={styles.entrySubtitle}>{exp.employer.company_name}</Text>}
                {exp.description && <Text style={styles.entryDescription}>{exp.description}</Text>}
              </View>
            ))}
        </View>
      )}

      {profile.skills && profile.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.skillsContainer}>
            {profile.skills.map((skill) => (
              <Text key={skill.id} style={styles.skillItem}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {profile.accessibility_needs && profile.accessibility_needs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Necesidades de Accesibilidad</Text>
          <View style={styles.accessibilityContainer}>
            {profile.accessibility_needs.map((need) => (
              <Text key={need.id} style={styles.accessibilityItem}>
                • {need.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {profile.disability_types && profile.disability_types.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Discapacidad</Text>
          <View style={styles.accessibilityContainer}>
            {profile.disability_types.map((disability) => (
              <View key={disability.id} style={{ marginBottom: 6 }}>
                <Text style={styles.disabilityItem}>• {disability.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {profile.detailed_accommodations && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ajustes Detallados</Text>
          <Text style={styles.personalStatement}>{profile.detailed_accommodations}</Text>
        </View>
      )}
    </Page>
  </Document>
)
