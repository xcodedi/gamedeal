import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';

const palette = {
  bg: '#0b0e14',
  surface: '#161a24',
  border: '#252b3a',
  muted: '#8a94a6',
  accent: '#00ffcc',
  pink: '#ff007f',
  text: '#ffffff',
  card: '#1b2330',
};

const PRODUCT_API_BASE = process.env.EXPO_PUBLIC_PRODUCT_API_URL || 'http://10.0.2.2:8000';
const SALES_API_BASE = process.env.EXPO_PUBLIC_SALES_API_URL || 'http://10.0.2.2:8100';
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'demo';

const mockProducts = [
  { id: 1, brand: 'Valve', model: 'Crimson Ember Vandal', description: 'Skin premium com acabamento raro.', category: 'CS2', currency: 'BRL', price: 1249.99, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80' },
  { id: 2, brand: 'Valorant', model: 'Faca Dragão Lendário', description: 'Knife skin premium.', category: 'Valorant', currency: 'BRL', price: 790, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80' },
  { id: 3, brand: 'WoW', model: 'Gold Boost', description: 'Aumente seu nível com suporte.', category: 'WOW', currency: 'BRL', price: 299, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80' },
];

const mockServices = [
  { id: 1, name: 'Nick', rating: 5, title: 'Rank Boost', category: 'Rank Boost', price: 240, description: 'Aumento de rank com suporte personalizado.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Lina', rating: 4.9, title: 'Coaching', category: 'Coaching', price: 180, description: 'Treino competitivo e estratégias.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Rafael', rating: 5, title: 'Upar', category: 'Upar', price: 320, description: 'Acompanhamento completo para missões.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
];

const mockSales = [
  { id: 1, title: 'Valorant Silver to Diamond Carry', date: 'Ontem', value: 120, status: 'Concluído' },
  { id: 2, title: '20,000 WoW Gold', date: '12 de outubro', value: 18.5, status: 'Concluído' },
];

const categories = ['Todos os Serviços', 'CS2', 'Valorant', 'WOW', 'Skins', 'Coaching', 'Rank Boost'];

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });

async function uploadToSupabase(uri, fileName = 'product-image.jpg') {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const path = `product-images/${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage.from('product-images').upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: true });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(data.path);
    return publicUrl.publicUrl;
  } catch (error) {
    console.log('Supabase upload failed:', error);
    return uri;
  }
}

function App() {
  const [screen, setScreen] = useState('auth');
  const [products, setProducts] = useState(mockProducts);
  const [sales, setSales] = useState(mockSales);
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]);
  const [selectedCategory, setSelectedCategory] = useState('Todos os Serviços');
  const [cart, setCart] = useState([mockProducts[0]]);

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${PRODUCT_API_BASE}/products?targetCurrency=BRL&size=10`);
      if (!response.ok) return;
      const payload = await response.json();
      const items = payload.content || payload;
      if (Array.isArray(items) && items.length > 0) {
        setProducts(items.map((item) => ({ ...item, category: item.category || 'CS2', price: Number(item.price || item.convertedPrice || 0), image: item.image || mockProducts[0].image })));
      }
    } catch (error) {
      console.log('Using mocked products', error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await fetch(`${SALES_API_BASE}/sales/history`);
      if (!response.ok) return;
      const payload = await response.json();
      if (Array.isArray(payload) && payload.length > 0) {
        setSales(payload.map((sale) => ({ id: sale.id, title: sale.productName, date: new Date(sale.createdAt).toLocaleDateString('pt-BR'), value: Number(sale.amount || 0), status: sale.status || 'Concluído' })));
      }
    } catch (error) {
      console.log('Using mocked sales', error);
    }
  };

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'Todos os Serviços') return mockServices;
    return mockServices.filter((service) => service.category === selectedCategory);
  }, [selectedCategory]);

  const handleLogin = () => setScreen('home');

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setCart([product]);
    setScreen('checkout');
  };

  const handleCreateListing = async (payload) => {
    try {
      await fetch(`${PRODUCT_API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.log('Save product locally skipped', error);
    }
    setProducts((current) => [
      { id: Date.now(), ...payload, price: Number(payload.price || 0) },
      ...current,
    ]);
    setScreen('home');
  };

  const renderScreen = () => {
    if (screen === 'auth') return <AuthScreen onLogin={handleLogin} />;
    if (screen === 'home') return <HomeScreen products={products} onOpenProduct={(product) => { setSelectedProduct(product); setScreen('detail'); }} onOpenServices={() => setScreen('services')} />;
    if (screen === 'services') return <ServicesScreen services={filteredServices} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} onOpenProduct={(product) => { setSelectedProduct(product); setScreen('detail'); }} />;
    if (screen === 'detail') return <DetailScreen product={selectedProduct} onBuy={() => handleAddToCart(selectedProduct)} onBack={() => setScreen('home')} />;
    if (screen === 'checkout') return <CheckoutScreen cart={cart} onBack={() => setScreen('detail')} onFinish={() => setScreen('success')} />;
    if (screen === 'success') return <SuccessScreen onGoHome={() => setScreen('home')} />;
    if (screen === 'profile') return <ProfileScreen profile={{ username: 'Username', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', reputation: '99.8%', totalDeals: '14,281', memberSince: 'Membro desde 2024' }} history={sales} onBack={() => setScreen('home')} />;
    if (screen === 'sales') return <SalesScreen sales={sales} onBack={() => setScreen('home')} onCreate={() => setScreen('createListing')} />;
    if (screen === 'createListing') return <CreateListingScreen onSubmit={handleCreateListing} onBack={() => setScreen('sales')} />;
    return null;
  };

  return (
    <SafeAreaView style={styles.appShell}>
      <StatusBar barStyle="light-content" />
      {screen !== 'auth' ? <BottomNav current={screen} setScreen={setScreen} /> : null}
      {renderScreen()}
    </SafeAreaView>
  );
}

function BottomNav({ current, setScreen }) {
  const items = [
    { key: 'home', label: 'Início', icon: 'home-outline' },
    { key: 'services', label: 'Serviços', icon: 'flash-outline' },
    { key: 'sales', label: 'Vender', icon: 'bag-outline' },
    { key: 'profile', label: 'Perfil', icon: 'person-outline' },
    { key: 'checkout', label: 'Carrinho', icon: 'cart-outline' },
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => (
        <Pressable key={item.key} style={styles.bottomNavItem} onPress={() => setScreen(item.key)}>
          <Ionicons name={item.icon} size={20} color={current === item.key ? palette.accent : palette.muted} />
          <Text style={[styles.navLabel, current === item.key && styles.navLabelActive]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function AuthScreen({ onLogin }) {
  return (
    <View style={styles.centeredPage}>
      <View style={styles.authCard}>
        <View style={styles.vaultBadge}><Ionicons name="lock-closed-outline" size={30} color={palette.accent} /></View>
        <Text style={styles.brandBig}>GAMEDEAL</Text>
        <Text style={styles.subtitle}>O mercado seguro para seus itens virtuais</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor={palette.muted} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput style={styles.input} placeholder="Digite sua senha" secureTextEntry placeholderTextColor={palette.muted} />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onLogin}><Text style={styles.primaryButtonText}>Entrar</Text></TouchableOpacity>
        <View style={styles.orRow}><View style={styles.line} /><Text style={styles.mutedText}>ou</Text><View style={styles.line} /></View>
        <TouchableOpacity style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Entrar com Google</Text></TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Entrar com Apple</Text></TouchableOpacity>
        <Text style={styles.authFooter}>Não tem conta? <Text style={styles.link}>Cadastre-se</Text></Text>
      </View>
    </View>
  );
}

function HomeScreen({ products, onOpenProduct, onOpenServices }) {
  const featured = products[0] || mockProducts[0];
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.headerRow}>
        <Text style={styles.brand}>GAMEDEAL</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}><Ionicons name="search-outline" size={18} color={palette.text} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><Ionicons name="notifications-outline" size={18} color={palette.text} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.tagRow}><Text style={styles.tagPink}>RARO</Text><Text style={styles.faintText}>Oferta do dia</Text></View>
        <Image source={{ uri: featured.image }} style={styles.heroImage} />
        <Text style={styles.displayTitle}>{featured.model || 'Crimson Ember Vandal'}</Text>
        <View style={styles.inlineRow}>
          <Text style={styles.priceText}>{formatCurrency(featured.price)}</Text>
          <TouchableOpacity style={styles.primaryButtonSmall} onPress={() => onOpenProduct(featured)}><Text style={styles.primaryButtonText}>GET DEAL</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {['Skins', 'CS2', 'VALORANT', 'WOW'].map((item) => (
            <TouchableOpacity key={item} style={styles.chip} onPress={onOpenServices}><Text style={styles.chipText}>{item}</Text></TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.inlineRowBetween}><Text style={styles.sectionTitle}>Ofertas</Text><Text style={styles.linkText} onPress={onOpenServices}>Ver tudo</Text></View>
        <View style={styles.productGrid}>
          {products.slice(0, 4).map((product) => (
            <Pressable key={product.id} style={styles.productCard} onPress={() => onOpenProduct(product)}>
              <Image source={{ uri: product.image }} style={styles.productThumb} />
              <Text style={styles.categoryTag}>{product.category || 'CS2'}</Text>
              <Text style={styles.productName}>{product.model}</Text>
              <View style={styles.inlineRowCentered}><Text style={styles.priceTextSmall}>{formatCurrency(product.price)}</Text><Text style={styles.oldPrice}>R$ 75,00</Text></View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function ServicesScreen({ services, selectedCategory, onSelectCategory, onOpenProduct }) {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.topBarTitle}>
        <Text style={styles.bigTitle}>Serviços Gaming</Text>
        <Ionicons name="options-outline" size={22} color={palette.text} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {categories.map((category) => (
          <TouchableOpacity key={category} style={[styles.chip, selectedCategory === category && styles.chipActive]} onPress={() => onSelectCategory(category)}>
            <Text style={[styles.chipText, selectedCategory === category && styles.chipTextActive]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.listCards}>
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <View style={styles.avatarRow}><Image source={{ uri: service.avatar }} style={styles.avatar} /><Text style={styles.userName}>{service.name}</Text></View>
              <Text style={styles.starText}>★ {service.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.categoryMuted}>{service.category}</Text>
            <View style={styles.divider} />
            <View style={styles.inlineRowBetween}>
              <View>
                <Text style={styles.mutedSmall}>A partir de</Text>
                <Text style={styles.priceText}>{formatCurrency(service.price)}</Text>
              </View>
              <TouchableOpacity style={styles.primaryButtonSmall} onPress={() => onOpenProduct({ ...mockProducts[0], model: service.title, description: service.description, category: service.category, price: service.price })}><Text style={styles.primaryButtonText}>Contratar</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function DetailScreen({ product, onBuy, onBack }) {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.topBarTitle}>
        <TouchableOpacity onPress={onBack}><Ionicons name="arrow-back-outline" size={24} color={palette.text} /></TouchableOpacity>
        <Text style={styles.bigTitle}>Detalhe do Item</Text>
        <Ionicons name="share-outline" size={22} color={palette.text} />
      </View>

      <Image source={{ uri: product.image }} style={styles.detailImage} />
      <View style={styles.detailMeta}><Text style={styles.categoryTag}>{product.category || 'Valorant'}</Text><Text style={styles.tagPink}>RARO</Text></View>
      <Text style={styles.detailTitle}>{product.model}</Text>

      <View style={styles.specCard}>
        <Text style={styles.cardTitle}>Especificações do anúncio</Text>
        <View style={styles.specRow}><Text style={styles.leftSpec}>Skin Pattern</Text><Text style={styles.rightSpec}>Crimson Ember (Phase 2)</Text></View>
        <View style={styles.divider} />
        <View style={styles.specRow}><Text style={styles.leftSpec}>Float Value</Text><Text style={styles.rightSpec}>0.00318 (Factory New)</Text></View>
        <View style={styles.divider} />
        <View style={styles.specRow}><Text style={styles.leftSpec}>Delivery Mode</Text><Text style={styles.rightSpec}>Instant Peer-to-Peer Safe Vault</Text></View>
      </View>

      <View style={styles.sellerCard}>
        <View style={styles.avatarRow}><Image source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' }} style={styles.avatarLarge} /><View><Text style={styles.userName}>Nome do vendedor</Text><Text style={styles.mutedSmall}>99.8% de avaliações positivas</Text></View></View>
        <Text style={styles.tag}>Verified</Text>
      </View>

      <View style={styles.buyBox}>
        <Text style={styles.mutedSmall}>Preço Total</Text>
        <Text style={styles.priceHighlight}>{formatCurrency(product.price)}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={onBuy}><Text style={styles.primaryButtonText}>Compra Segura Instantânea</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function CheckoutScreen({ cart, onBack, onFinish }) {
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const fee = total * 0.025;
  const net = total + fee;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.topBarTitle}>
        <TouchableOpacity onPress={onBack}><Ionicons name="arrow-back-outline" size={24} color={palette.text} /></TouchableOpacity>
        <Text style={styles.bigTitle}>Finalização</Text>
      </View>
      <View style={styles.checkColumn}>
        <Text style={styles.sectionTitle}>Carrinho</Text>
        {cart.map((item) => (
          <View key={item.id} style={styles.checkoutCard}>
            <Image source={{ uri: item.image }} style={styles.checkoutThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.categoryTag}>{item.category || 'Valorant'}</Text>
              <Text style={styles.checkoutTitle}>{item.model}</Text>
              <Text style={styles.mutedSmall}>Vendedor: Nick</Text>
              <Text style={styles.priceTextSmall}>{formatCurrency(item.price)}</Text>
            </View>
            <Ionicons name="trash-outline" size={22} color={palette.pink} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.receiptBox}>
          <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Subtotal</Text><Text>{formatCurrency(total)}</Text></View>
          <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Vault Escrow Fee (2.5%)</Text><Text>{formatCurrency(fee)}</Text></View>
          <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Instant Secure Transfer</Text><Text style={styles.accentText}>Grátis</Text></View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}><Text style={styles.totalLabel}>Net Crypto Due</Text><Text style={styles.accentText}>{formatCurrency(net)}</Text></View>
        </View>
        <View style={styles.noticeRow}><Ionicons name="close-circle-outline" size={18} color={palette.pink} /><Text style={styles.noticeText}>O cofre de garantia retém o pagamento. Os fundos só são liberados ao vendedor após a troca del item ser verificada.</Text></View>
        <TouchableOpacity style={styles.primaryButton} onPress={onFinish}><Text style={styles.primaryButtonText}>Finalizar Depósito no Cofre</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function SuccessScreen({ onGoHome }) {
  return (
    <View style={styles.centeredPage}>
      <View style={styles.successWrap}>
        <View style={styles.successIcon}><Ionicons name="checkmark" size={36} color={palette.bg} /></View>
        <Text style={styles.displayTitle}>Compra confirmada</Text>
        <Text style={styles.subtitle}>Seu item foi enviado para o cofre com garantia digital.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={onGoHome}><Text style={styles.primaryButtonText}>Voltar ao início</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function ProfileScreen({ profile, history, onBack }) {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.profileHeader}><TouchableOpacity onPress={onBack}><Ionicons name="arrow-back-outline" size={24} color={palette.text} /></TouchableOpacity></View>
      <View style={styles.profileTopRow}>
        <Image source={{ uri: profile.avatar }} style={styles.avatarLarge} />
        <View style={{ flex: 1 }}>
          <View style={styles.inlineRowCentered}><Text style={styles.displayTitle}>{profile.username}</Text><Text style={styles.tag}>PRO</Text></View>
          <Text style={styles.mutedSmall}>{profile.memberSince}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statLabel}>Positive Rep</Text><Text style={styles.statNumber}>{profile.reputation}</Text></View>
        <View style={styles.statBox}><Text style={styles.statLabel}>Total Deals</Text><Text style={styles.statNumber}>{profile.totalDeals}</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anúncios Ativos</Text>
        <View style={styles.productGrid}>
          {mockProducts.slice(0, 2).map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.image }} style={styles.productThumb} />
              <Text style={styles.categoryMuted}>{product.category}</Text>
              <Text style={styles.productName}>{product.model}</Text>
              <Text style={styles.priceTextSmall}>{formatCurrency(product.price)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico</Text>
        {history.map((item) => (
          <View key={item.id} style={styles.historyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>{item.title}</Text>
              <Text style={styles.mutedSmall}>{item.date} • {item.status}</Text>
            </View>
            <Text style={styles.accentText}>+{formatCurrency(item.value)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function SalesScreen({ sales, onBack, onCreate }) {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.topBarTitle}>
        <TouchableOpacity onPress={onBack}><Ionicons name="arrow-back-outline" size={24} color={palette.text} /></TouchableOpacity>
        <Text style={styles.bigTitle}>Painel de Vendas</Text>
        <Ionicons name="notifications-outline" size={22} color={palette.text} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statLabel}>Anúncios</Text><Text style={styles.statNumber}>5</Text></View>
        <View style={styles.statBox}><Text style={styles.statLabel}>Vendas</Text><Text style={styles.statNumber}>12</Text></View>
        <View style={styles.statBox}><Text style={styles.statLabel}>Faturamento</Text><Text style={styles.statNumberAccent}>R$ 3.420</Text></View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onCreate}><Text style={styles.primaryButtonText}>Criar Anúncio</Text></TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meus Anúncios Ativos</Text>
        {mockProducts.map((product) => (
          <View key={product.id} style={styles.historyRow}>
            <Image source={{ uri: product.image }} style={styles.checkoutThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>{product.model}</Text>
              <Text style={styles.accentText}>{formatCurrency(product.price)}</Text>
            </View>
            <Text style={styles.tag}>Ativo</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vendas Recentes</Text>
        {sales.map((sale) => (
          <View key={sale.id} style={styles.historyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>{sale.title}</Text>
              <Text style={styles.accentText}>{formatCurrency(sale.value)}</Text>
            </View>
            <Text style={styles.tagMuted}>Vendido</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function CreateListingScreen({ onSubmit, onBack }) {
  const [name, setName] = useState('Crimson Ember Vandal');
  const [category, setCategory] = useState('CS2');
  const [description, setDescription] = useState('Skin premium com garantia e entrega segura.');
  const [price, setPrice] = useState('1249.99');
  const [imageUri, setImageUri] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) {
      const uploaded = await uploadToSupabase(result.assets[0].uri, 'product-upload.jpg');
      setImageUri(uploaded);
    }
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.topBarTitle}>
        <TouchableOpacity onPress={onBack}><Ionicons name="arrow-back-outline" size={24} color={palette.text} /></TouchableOpacity>
        <Text style={styles.bigTitle}>Novo Anúncio</Text>
      </View>
      <Image source={{ uri: imageUri }} style={styles.heroImage} />
      <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}><Text style={styles.secondaryButtonText}>Adicionar imagem com Supabase Storage</Text></TouchableOpacity>

      <View style={styles.formGroup}><Text style={styles.label}>Nome do item</Text><TextInput value={name} onChangeText={setName} style={styles.input} /></View>
      <View style={styles.formGroup}><Text style={styles.label}>Categoria</Text><TextInput value={category} onChangeText={setCategory} style={styles.input} /></View>
      <View style={styles.formGroup}><Text style={styles.label}>Descrição</Text><TextInput value={description} onChangeText={setDescription} style={styles.textArea} multiline /></View>
      <View style={styles.formGroup}><Text style={styles.label}>Preço</Text><TextInput value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={styles.input} /></View>
      <TouchableOpacity style={styles.primaryButton} onPress={() => onSubmit({ brand: 'GAMEDEAL', model: name, description, category, currency: 'BRL', price: Number(price), image: imageUri })}><Text style={styles.primaryButtonText}>Salvar anúncio</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appShell: { flex: 1, backgroundColor: palette.bg },
  page: { flex: 1, backgroundColor: palette.bg },
  pageContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 20 },
  centeredPage: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.bg, padding: 20 },
  authCard: { width: '100%', maxWidth: 420, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 24, padding: 24 },
  vaultBadge: { width: 64, height: 64, borderRadius: 16, borderWidth: 1, borderColor: palette.accent, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandBig: { fontSize: 40, textAlign: 'center', color: palette.text, fontWeight: '900', textTransform: 'uppercase' },
  brand: { fontSize: 24, color: palette.text, fontWeight: '900', textTransform: 'uppercase' },
  subtitle: { color: palette.muted, textAlign: 'center', marginBottom: 24 },
  displayTitle: { fontSize: 30, color: palette.text, fontWeight: '800', letterSpacing: 0.5 },
  bigTitle: { fontSize: 24, color: palette.text, fontWeight: '700' },
  sectionTitle: { fontSize: 20, color: palette.text, fontWeight: '800', marginBottom: 12 },
  topBarTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, alignItems: 'center', justifyContent: 'center' },
  heroCard: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 24, padding: 16, marginBottom: 18 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tag: { backgroundColor: 'transparent', borderColor: palette.accent, borderWidth: 1, borderRadius: 4, color: palette.accent, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  tagPink: { backgroundColor: 'transparent', borderColor: palette.pink, borderWidth: 1, borderRadius: 4, color: palette.pink, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  faintText: { color: palette.muted, fontSize: 13 },
  heroImage: { width: '100%', height: 220, borderRadius: 12, backgroundColor: palette.card, marginBottom: 14 },
  inlineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  inlineRowCentered: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inlineRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceText: { fontSize: 24, color: palette.accent, fontWeight: '800' },
  priceTextSmall: { fontSize: 20, color: palette.accent, fontWeight: '800' },
  oldPrice: { color: palette.muted, textDecorationLine: 'line-through', fontSize: 12 },
  primaryButton: { backgroundColor: palette.accent, borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  primaryButtonSmall: { backgroundColor: palette.accent, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: palette.bg, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  secondaryButton: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  secondaryButtonText: { color: palette.text, fontWeight: '600' },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: palette.text, marginBottom: 6 },
  input: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, color: palette.text },
  textArea: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, color: palette.text, minHeight: 120, textAlignVertical: 'top' },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: palette.border },
  mutedText: { color: palette.muted, paddingHorizontal: 12 },
  authFooter: { color: palette.muted, textAlign: 'center', marginTop: 20 },
  link: { color: palette.accent, textDecorationLine: 'underline' },
  chipRow: { paddingVertical: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.surface, marginRight: 8 },
  chipActive: { borderColor: palette.accent },
  chipText: { color: palette.muted, fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: palette.accent },
  section: { marginTop: 20 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  productCard: { width: '48%', backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 18, padding: 12, marginBottom: 12 },
  productThumb: { width: '100%', height: 100, borderRadius: 10, backgroundColor: palette.card, marginBottom: 8 },
  categoryTag: { color: palette.accent, fontSize: 11, textTransform: 'uppercase', fontWeight: '700', marginVertical: 6 },
  productName: { color: palette.text, fontWeight: '600', marginBottom: 6 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: palette.bg, borderTopColor: palette.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, paddingBottom: 20 },
  bottomNavItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navLabel: { color: palette.muted, fontSize: 11, marginTop: 4 },
  navLabelActive: { color: palette.accent },
  listCards: { marginTop: 10 },
  serviceCard: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 14 },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarLarge: { width: 64, height: 64, borderRadius: 32 },
  userName: { color: palette.text, fontWeight: '600' },
  starText: { color: palette.accent, fontWeight: '700' },
  serviceDescription: { color: palette.text, marginBottom: 8 },
  categoryMuted: { color: palette.muted, fontSize: 12, textTransform: 'uppercase', marginBottom: 8 },
  divider: { height: 1, backgroundColor: palette.border, marginVertical: 12 },
  detailImage: { width: '100%', height: 260, borderRadius: 18, backgroundColor: palette.card, marginBottom: 18 },
  detailMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailTitle: { fontSize: 34, color: palette.text, fontWeight: '800', marginVertical: 12 },
  specCard: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 20, padding: 16, marginTop: 18 },
  cardTitle: { fontSize: 16, color: palette.text, fontWeight: '800', marginBottom: 8 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginVertical: 10 },
  leftSpec: { color: palette.muted },
  rightSpec: { color: palette.text, textAlign: 'right', flexShrink: 1 },
  sellerCard: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  buyBox: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 20, padding: 16, marginTop: 18 },
  priceHighlight: { color: palette.accent, fontSize: 26, fontWeight: '800', marginBottom: 12 },
  checkColumn: { marginBottom: 18 },
  checkoutCard: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkoutThumb: { width: 56, height: 56, borderRadius: 12, marginRight: 12 },
  checkoutTitle: { color: palette.text, fontWeight: '600', marginBottom: 4 },
  receiptBox: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 20, padding: 16 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  receiptLabel: { color: palette.muted },
  totalLabel: { fontWeight: '800', color: palette.text },
  accentText: { color: palette.accent, fontWeight: '700' },
  noticeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 12, marginBottom: 14 },
  noticeText: { color: palette.muted, fontSize: 13, flex: 1 },
  successWrap: { alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 420 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: palette.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  profileTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 22, marginBottom: 18 },
  statBox: { flex: 1, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 12 },
  statLabel: { color: palette.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 },
  statNumber: { color: palette.text, fontSize: 26, fontWeight: '800', marginTop: 8 },
  statNumberAccent: { color: palette.accent, fontSize: 20, fontWeight: '800', marginTop: 8 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 8 },
  historyTitle: { color: palette.text, fontWeight: '600' },
  mutedSmall: { color: palette.muted, fontSize: 12 },
  tagMuted: { backgroundColor: 'transparent', borderColor: palette.border, borderWidth: 1, borderRadius: 4, color: palette.muted, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  linkText: { color: palette.accent, fontWeight: '600' },
});

export default App;
