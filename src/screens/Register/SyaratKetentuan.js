import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import {
	Container,
	Header,
	Body,
	Left,
	Right,
	Title,
	Content,
	Icon,
	Button,	
	Text,
	Spinner,
	View,
	InputGroup, 
    Input, 
    Card, 
    CardItem,
    Thumbnail
} from 'native-base';
import HTMLView from 'react-native-htmlview';

class SyaratKetentuan extends Component {
    
  render() {
    const PolicyHTML = `<p><b><i>Definisi</i></b><br />Dalam ketentuan penggunaan ini menggunakan istilah – istilah sebagai berikut:<span><br />a.) Pos Indonesia adalah sebuah badan usaha milik negara (<a href="https://id.wikipedia.org/wiki/BUMN">BUMN</a>) Indonesia yang bergerak di bidang layanan <a href="https://id.wikipedia.org/wiki/Pos">pos</a>.<br /></span><span>b.) Aplikasi Mobile adalah layanan software yang di buat dan di teruntukan perangkat portable smartphone yang mengaharuskan proses mendownload software mobile aplikasi di playstore aplikasi agar dapat di gunakan.<br /></span><span>c.) CRM (Customer Relationship Management) adalah strategi untuk mengelola hubungan antara manusia dengan teknologi yang dapat membantu pelanggan dalam online booking atau transaksi kiriman melalui Aplikasi CRM Mobile.<br /></span><span>d.) <em>One-Time Password</em>(OTP) adalah kode yang dihasilkan secara acak dan dikirim via <em>Short Message Service</em> (“SMS”) ke telepon selular dan/atau <em>electronic mail</em> <em>/ email</em> milik Pelanggan yang sudah terdaftar pada Aplikasi CRM Mobile<br /><br /></span><b><i>Registrasi Aplikasi CRM Mobile</i></b><br /><span>a.) Sebelum pelanggan menggunakan aplikasi, pelanggan diwajibkan harus melakukan registrasi terlebih dahulu dengan mengisi form data sebagai berikut:<br /></span><span> - Masukkan Nama Lengkap<br /> - Masukkan No. HP yang aktif<br /> - Masukkan E-mail yang sudah tersedia<br /> - Masukkan Password<br /><span>NB: Diharapkan form data pada register dan Detail Profil valid atau benar sesuai dengan data pelanggan, agar pada saat Online Booking data pengirim sama dengan data detail profil<br /></span><span>b.) Mekanisme Registrasi:<br />- Pelanggan mendapatkan OTP SMS Notifikasi atau Email Notifikasi, yang dikirimkan oleh Sistem Aplikasi CRM Mobile ke Nomor telepon selular dan Email pelanggan setelah mengisi form data registrasi.<br />- Memasukkan OTP SMS Notifikasi atau Email Notifikasi, yang dikirimkan oleh Sistem Aplikasi CRM Mobile ke Nomor Telepon selular dan Email pelanggan.<br />- Setelah registrasi berhasil, calon pengguna akan menerima dan pemberitahuan sebagai tanda telah terdaftar sebagai pengguna Aplikasi CRM Mobile<br /><br /><b><i>Syarat dan Ketentuan penggunaan Aplikasi CRM Mobile</i></b><br /><span>a.) Untuk dapat mengakses fitur Aplikasi CRM Mobile yang memerlukan Pengguna untuk login, maka pelanggan harus menggunakan username (e-mail) serta password yang sudah didaftarkan pada Aplikasi CRM Mobile sebelumnya. Mekanisme dan ketentuan registrasi Aplikasi CRM Mobile dapat dilihat pada syarat dan ketentuan registrasi Aplikasi CRM Mobile.<br /></span><span>b.) Setelah melakukan login Pelanggan dapat menggunakan layanan Aplikasi CRM Mobile Online Booking tidak hanya untuk transaksi kiriman, namun juga untuk melihat informasi lacak kiriman, status kiriman, cek tarif, cek kode pos, dll.<br /></span><span>c.) Pelanggan dapat melengkapi data pribadi pada fitur “Akun”, kemudian di save agar data “Akun” yang ada digunakan pada data pengirim proses “Online Booking”.<br /><br /><b><i>Syarat dan ketentuan kiriman barang</i></b><br /><span>a.) Sebelum pengirim melakukan kiriman barang wajib mengemas barang kirimannya dengan baik untuk melindungi isi barang kirimannya selama pengangkutan. Apabila timbul suatu kerugian yang disebabkan karena pengemasan yang kurang sempurna, maka kerugian tersebut menjadi tanggung jawab pengirim.<br /></span><span>b.) Berat kiriman yang dipakai sebagai acuan dalam pembayaran adalah berat asli atau berat dimensi yang memiliki nilai lebih besar. Apabila terdapat penambahan berat yang diakibatkan oleh adanya proses pengemasan tambahan yang dilakukan oleh Pos Indonesia, maka yang digunakan sebagai acuan dalam penagihan adalah berat setelah dikemas ulang atau tambahan.<br /></span><span>c.) Pengirim wajib memberitahukan dengan jelas dan benar isi dan nilai barang kiriman. Keterangan yang tidak benar mengenai hal tersebut sepenuhnya menjadi tanggung jawab pengirim.<br /></span><span>d.) Pos Indonesia melarang pengiriman barang – barang sebagai berikut:<br /> - Jenazah atau bagian-bagiannya,<br /> - Binatang hidup maupun mati,<br /> - Obat terlarang,<br /> - Senjata dan amunisi,<br /> - Bahan lain yang mudah terbakar,<br /> - Barang seni bernilai tinggi,<br /> - Surat berharga, uang, logam mulia, perhiasan bernilai tinggi atau sejenisnya dan barang-barang yang dilarang oleh hukum yang ditetapkan oleh Negara.<br /></span><span>e.) Pos Indonesia berhak namun tidak wajib untuk memeriksa barang kiriman demi memastikan bahwa barang yang dikirim tidak melanggar hukum yang berlaku. Apabila tanpa sepengetahuan pihak Pos Indonesia, pengirim mengirimkan barang-barang yang dilarang dalam pada point sebelumnya, maka dengan ini pengirim membebaskan Pos Indonesia dari seluruh biaya kerusakan atau lainnya dan atas tuntutan dari pihak hukum atau manapun.<br /></span><span>f.) Dalam proses pengiriman, Pos Indonesia tidak menjamin bahwa seluruh proses berlangsung dengan lancar dan layak, yang disebabkan oleh peristiwa yang mungkin timbul diluar kemampuan Pos Indonesia di wilayah yang dilalui transportasi Pos Indonesia.<br /></span><span>g.) Pos Indonesia tidak akan memberikan ganti rugi kepada pengirim akibat dari kejadian atau hal-hal yang diluar kemampuan kontrol Pos atau kerusakan akibat bencana alam (Force Majeure).<br /></span><span>h.) Apabila tidak ada keluhan dari penerima pada saat barang kiriman diserahkan, maka barang kiriman dianggap telah diterima dengan baik dan benar.<br /></span><span>i.) Pengaduan/klaim atas kehilangan atau kerusakan harus diajukan pengirim (bukan penerima) selambat-lambatnya dalam waktu 3 (tiga) hari terhitung sejak diterimanya barang tersebut beserta dokumen-dokumen yang terkait.<br /></span><span>j.) Selain perjanjian atau syarat dan ketentuan yang tertulis pada resi ini Pos Indonesia tidak dapat dituntut dan dibebani dengan perjanjian atau dasar hukum lainnya kecuali dengan perjanjian tertulis yang disetujui oleh penanggung jawab Pos Indonesia yang berwenang.<br /></span><span>k.) Saat menyerahkan barang kepada Pos Indonesia, Pengirim dianggap telah membaca dan menyetujui semua syarat dan ketentuan pengiriman yang tertera pada resi ini tanpa adanya paksaan dari pihak manapun, serta membebaskan Pos Indonesia dari segala tuntutan atau bentuk ganti rugi.<br /></span><span><br /><br /></p>`;
    return (
        <Container style={styles.container}>
          <Content style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
            <HTMLView
                value={PolicyHTML}
                stylesheet={styles}
            />
          </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#f26623',
  },
  p: {
    lineHeight: 20
  },
  span: {
      lineHeight:25
  },
  container : {    
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
});

export default SyaratKetentuan;