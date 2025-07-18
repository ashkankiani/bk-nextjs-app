import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'

import imageLogo from '@/public/images/logo.png'

Font.register({
  family: 'Yekan',
  src: process.env.NEXT_PUBLIC_FULL_PATH + '/fonts/yekan-bakh/ttf/YekanBakhFaNum-SemiBold.ttf',
})

export default function DocumentPdfFactor({ data, orientation = 'portrait' }) {
  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Yekan',
      fontSize: 10,
      fontWeight: 'medium',
      padding: 20,
      textAlign: 'right',
    },
    header: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 10,
      textAlign: 'center',
    },
    logo: {
      marginRight: 'auto',
      marginLeft: 'auto',
      textAlign: 'center',
      width: 110,
    },
    item: {
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      borderBottom: 1,
      borderColor: '#d2d2d2',
      paddingTop: 5,
      paddingBottom: 5,
    },
    value: {},
  })

  return (
    <Document language="fa-IR">
      <Page orientation={orientation} size="A5" style={styles.page}>
        <View style={styles.header} fixed>
          <Image alt="logo" style={styles.logo} src={imageLogo.src} />
        </View>

        {data.map((item, rowIndex) => (
          <View key={rowIndex} style={styles.item}>
            {item.map((value, columnIndex) => (
              <View key={columnIndex} style={styles.value}>
                <Text>{value}</Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  )
}
