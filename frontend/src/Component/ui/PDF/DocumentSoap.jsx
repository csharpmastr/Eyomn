import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  header: {
    backgroundColor: "#6A9A92",
    padding: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  clinicName: { fontSize: 18, color: "white" },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#222222",
  },
  patientInfo: {
    color: "#222222",
    width: "100%",
    fontSize: 12,
    backgroundColor: "#F8FBFC",
  },
  rowSpaceBetween: { flexDirection: "row", justifyContent: "space-between" },
  row: { flexDirection: "row", width: "100%" },
  doctorLabel: { fontSize: 12 },
  ContainerBox: { flexDirection: "column" },
  SoapBox: {
    border: 1,
    borderColor: "#c3c3c3",
    width: "100%",
    height: "auto",
    padding: 12,
  },
  boxTitle: {
    fontSize: 12,
    color: "#1E8282",
    fontWeight: "bold",
    marginBottom: 12,
  },
  boxContent: { fontSize: 10, color: "#222222" },
});

const DocumentSoap = ({ patientData }) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.clinicName}>Sample Visual Care Clinic</Text>
        </View>

        {/* Title */}
        <View>
          <Text style={styles.title}>Standardize Medical Record</Text>
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfo}>
          <View style={styles.rowSpaceBetween}>
            <View
              style={{
                border: 1,
                borderColor: "#c3c3c3",
                width: "50%",
                paddingVertical: 8,
                paddingHorizontal: 8,
                borderTopLeftRadius: 4,
              }}
            >
              <Text>{patientData.name}</Text>
            </View>
            <View
              style={{
                display: "flex",
                border: 1,
                borderColor: "#c3c3c3",
                width: "50%",
                paddingVertical: 8,
                alignItems: "flex-end",
                paddingHorizontal: 8,
                borderTopRightRadius: 4,
              }}
            >
              <Text>{patientData.date}</Text>
            </View>
          </View>
          <View style={styles.rowSpaceBetween}>
            <View
              style={{
                width: "50%",
              }}
            >
              <View style={styles.row}>
                <View
                  style={{
                    border: 1,
                    borderColor: "#c3c3c3",
                    width: "50%",
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                  }}
                >
                  <Text>{patientData.age}</Text>
                </View>
                <View
                  style={{
                    border: 1,
                    borderColor: "#c3c3c3",
                    width: "50%",
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                  }}
                >
                  <Text>{patientData.gender}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                border: 1,
                borderColor: "#c3c3c3",
                width: "50%",
                paddingVertical: 8,
                alignItems: "flex-end",
                paddingHorizontal: 8,
              }}
            >
              <Text style={styles.doctorLabel}>
                Doctor {patientData.doctor}
              </Text>
            </View>
          </View>
        </View>

        {/* SOAP Sections */}
        <View style={styles.ContainerBox}>
          <View style={styles.SoapBox}>
            <Text style={styles.boxTitle}>| Subjective (S)</Text>
            <Text style={styles.boxContent}>{patientData.subjective}</Text>
          </View>
          <View style={styles.SoapBox}>
            <Text style={styles.boxTitle}>| Objective (O)</Text>
            <Text style={styles.boxContent}>{patientData.objective}</Text>
          </View>
          <View style={styles.SoapBox}>
            <Text style={styles.boxTitle}>| Assessment (A)</Text>
            <Text style={styles.boxContent}>{patientData.assessment}</Text>
          </View>
          <View style={styles.SoapBox}>
            <Text style={styles.boxTitle}>| Plan (P)</Text>
            <Text style={styles.boxContent}>{patientData.plan}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DocumentSoap;
