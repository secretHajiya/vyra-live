import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, Share, Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import { Camera } from "expo-camera";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const BG = "#0B0B14", GOLD = "#FFC658", PURPLE = "#7B2CF6";
const AD_UNIT = __DEV__ ? TestIds.BANNER : "ca-app-pub-5672887722239131/9954360069";
const GITHUB_URL = "https://github.com/new"; // replace with your repo URL

const streams = [
  { name: "AvaMusic", title: "Late night vibes", viewers: "12.4K" },
  { name: "DineWithMark", title: "Cooking live", viewers: "8.1K" },
  { name: "StyleWithLia", title: "Fashion haul", viewers: "5.7K" },
];
const creators = ["Ava", "Mark", "Lia", "Zee", "Kofi", "Nia"];
type Tab = "discover" | "live" | "messages" | "profile";

const randomId = () => Math.random().toString(36).slice(2, 14);

export default function App() {
  const [tab, setTab] = useState<Tab>("discover");
  const [room, setRoom] = useState<string | null>(null);
  const url = room ? `https://meet.jit.si/${room}` : "";

  const goLive = async () => {
    await Camera.requestCameraPermissionsAsync();
    await Camera.requestMicrophonePermissionsAsync();
    setRoom(`VyraLive-${randomId()}`);
    setTab("live");
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar style="light" />
      <View style={s.top}>
        <Text style={s.logo}>VYRA <Text style={{ color: GOLD }}>LIVE</Text></Text>
        <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)} style={s.gh}>
          <Text style={s.ghText}>Publish to GitHub</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {tab === "live" && room ? (
          <View style={{ flex: 1 }}>
            <WebView
              source={{ uri: `${url}#config.prejoinPageEnabled=false` }}
              style={{ flex: 1, backgroundColor: BG }}
              javaScriptEnabled domStorageEnabled
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback
              mediaCapturePermissionGrantType="grant"
              originWhitelist={["*"]}
            />
            <View style={s.row}>
              <TouchableOpacity style={s.chip} onPress={() => Share.share({ message: `Watch me live on VYRA LIVE: ${url}` })}><Text style={s.chipT}>Share room</Text></TouchableOpacity>
              <TouchableOpacity style={s.chip} onPress={() => { setRoom(null); setTab("discover"); }}><Text style={s.chipT}>End live</Text></TouchableOpacity>
            </View>
          </View>
        ) : tab === "messages" ? (
          <ScrollView style={s.pad}>{streams.map((c) => (
            <View key={c.name} style={s.msg}><Text style={s.h}>{c.name}</Text><Text style={s.sub}>New message</Text></View>
          ))}</ScrollView>
        ) : tab === "profile" ? (
          <View style={s.pad}><Text style={s.h}>Guest creator</Text><Text style={s.sub}>0 followers · 0 following · 0 likes</Text></View>
        ) : (
          <ScrollView contentContainerStyle={s.pad}>
            <Text style={s.slogan}>Go Live. Be Seen. Be Heard.</Text>
            <TouchableOpacity onPress={goLive} activeOpacity={0.85}>
              <LinearGradient colors={[GOLD, PURPLE]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.goLive}>
                <Text style={s.goLiveT}>GO LIVE</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={s.section}>Trending Live Now</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {streams.map((st) => (
                <TouchableOpacity key={st.name} style={s.card} onPress={() => { setRoom(`VyraLive-${st.name}`); setTab("live"); }}>
                  <View style={s.badge}><Text style={s.badgeT}>LIVE</Text></View>
                  <Text style={s.h}>{st.name}</Text><Text style={s.sub}>{st.title} · {st.viewers}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.section}>For You · Discover Creators</Text>
            <View style={s.grid}>{creators.map((c) => (
              <View key={c} style={{ alignItems: "center", width: "30%", marginBottom: 16 }}>
                <LinearGradient colors={[GOLD, PURPLE]} style={s.avatar}><Text style={s.avatarT}>{c[0]}</Text></LinearGradient>
                <Text style={s.sub}>{c}</Text>
              </View>
            ))}</View>
          </ScrollView>
        )}
      </View>

      <View style={s.ad}><BannerAd unitId={AD_UNIT} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} /></View>

      <View style={s.nav}>
        {(["discover", "live", "messages", "profile"] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={s.navI} onPress={() => (t === "live" && !room ? goLive() : setTab(t))}>
            <Text style={[s.navT, tab === t && { color: GOLD }]}>{t[0].toUpperCase() + t.slice(1)}</Text>
            {t === "messages" && <View style={s.dot}><Text style={s.dotT}>3</Text></View>}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, paddingTop: 40 },
  logo: { color: "#fff", fontSize: 22, fontWeight: "800" },
  gh: { borderWidth: 1, borderColor: PURPLE, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  ghText: { color: "#fff", fontSize: 12 },
  pad: { padding: 16 },
  slogan: { color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 16 },
  goLive: { borderRadius: 24, paddingVertical: 22, alignItems: "center", shadowColor: GOLD, shadowOpacity: 0.6, shadowRadius: 20, elevation: 12 },
  goLiveT: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: 2 },
  section: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 24, marginBottom: 12 },
  card: { width: 160, height: 210, backgroundColor: "#16162A", borderRadius: 18, padding: 12, marginRight: 12, justifyContent: "flex-end" },
  badge: { position: "absolute", top: 10, left: 10, backgroundColor: "#FF2D55", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeT: { color: "#fff", fontSize: 10, fontWeight: "800" },
  h: { color: "#fff", fontWeight: "700", fontSize: 15 },
  sub: { color: "#9a9ab0", fontSize: 12, marginTop: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  avatar: { width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  avatarT: { color: "#fff", fontSize: 24, fontWeight: "800" },
  msg: { backgroundColor: "#16162A", borderRadius: 14, padding: 14, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "center", gap: 10, padding: 10 },
  chip: { backgroundColor: "#16162A", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  chipT: { color: "#fff" },
  ad: { alignItems: "center", backgroundColor: BG },
  nav: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#22223a", paddingVertical: 10, backgroundColor: BG },
  navI: { flex: 1, alignItems: "center" },
  navT: { color: "#9a9ab0", fontSize: 12, fontWeight: "600" },
  dot: { position: "absolute", top: -6, right: 18, backgroundColor: PURPLE, borderRadius: 9, minWidth: 18, alignItems: "center" },
  dotT: { color: "#fff", fontSize: 10, fontWeight: "800" },
});
