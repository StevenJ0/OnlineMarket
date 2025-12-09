// src/components/footer.tsx

"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white">
                OM
              </div>
              <span className="text-white font-bold text-lg">OnlineMarket</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Platform marketplace terpercaya untuk jual beli barang berkualitas
              dengan ribuan penjual terverifikasi.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-orange-500 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-500 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                title="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-pink-500 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
              Informasi
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Kebijakan Privasi</span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Syarat & Ketentuan</span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1 group"
                >
                  <span>FAQ</span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="/buka-toko"
                  className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Buka Toko</span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hubungi Kami */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
              Hubungi Kami
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-300">Kantor Pusat</p>
                  <p className="text-slate-400">Jakarta, Indonesia</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-300">Telepon</p>
                  <p className="text-slate-400">+62 812-3456-7890</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-300">Email</p>
                  <p className="text-slate-400">support@onlinemarket.id</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Highlight Section */}
        <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-bold text-lg mb-2">
                Mulai Berjualan di OnlineMarket
              </h4>
              <p className="text-slate-400 text-sm">
                Bergabunglah dengan ribuan penjual sukses dan tingkatkan bisnis
                Anda bersama kami.
              </p>
            </div>
            <Link
              href="/buka-toko"
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span>Buka Toko Sekarang</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>
              &copy; {currentYear}{" "}
              <span className="text-orange-500 font-semibold">
                OnlineMarket
              </span>
              . Semua hak dilindungi.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="hover:text-orange-400 transition-colors"
              >
                Keamanan
              </Link>
              <Link
                href="#"
                className="hover:text-orange-400 transition-colors"
              >
                Perlindungan Data
              </Link>
              <Link
                href="#"
                className="hover:text-orange-400 transition-colors"
              >
                Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
