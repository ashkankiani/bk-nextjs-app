import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

import imageLogo from "@/public/images/logo.png";

Font.register({
  family: 'Yekan',
  src: process.env.NEXT_PUBLIC_FULL_PATH + '/fonts/yekan-bakh/ttf/YekanBakhFaNum-SemiBold.ttf'
});

export default function DocumentPdfTable({data, keys, orientation = "portrait"}) {

  const header = keys.split(",")

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Yekan',
      fontWeight: "medium",
      fontSize: 7,
      padding: 20,
    },
    header: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 10,
      textAlign: "center"
    },
    logo: {
      marginRight: "auto",
      marginLeft: "auto",
      textAlign: "center",
      width: 110,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderColor: "#333",

    },
    tableHead: {
      backgroundColor: "#c2ffc2",
      flexDirection: "row",
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    tableCol: {
      width: (100 / header.length) + "%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: {
      textAlign: "center"
    }
  });

  return (
    <Document language="fa-IR">
      <Page orientation={orientation} size="A4" style={styles.page}>

        <View style={styles.header} fixed>
          <Image alt="logo" style={styles.logo} src={imageLogo.src}/>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHead]}>
            {
              header.map((item, rowIndex) =>
                <View key={rowIndex} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item}</Text>
                </View>
              )
            }
          </View>
          {
            data.map((item, rowIndex) =>

              <View key={rowIndex} style={styles.tableRow}>
                {
                  item.map((value, columnIndex) =>
                    <View key={columnIndex} style={styles.tableCol}>
                      <Text style={styles.tableCell}>{value}</Text>
                    </View>
                  )
                }
              </View>
            )
          }
        </View>

      </Page>
    </Document>
  );
}


