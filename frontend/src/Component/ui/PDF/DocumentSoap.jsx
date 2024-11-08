import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  header: {
    backgroundColor: "#6A9A92",
    padding: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  clinicName: { fontSize: 18, color: "white" },
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

        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 12 }}>
            Standardize Medical Record
          </Text>
        </View>

        {/* Patient Info */}
        <View
          style={{
            color: "#222222",
            width: "100%",
            marginBottom: 12,
            fontSize: 12,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>{patientData.name}</Text>
            <Text>{patientData.date}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text>{patientData.age}</Text>
              <Text style={{ marginHorizontal: 4 }}>|</Text>
              <Text>{patientData.gender}</Text>
            </View>
            <Text>Doctor</Text>
          </View>
        </View>

        {/* SOAP Sections */}
        <View>
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
        </View>
      </Page>
    </Document>
  );
};

export default DocumentSoap;
