import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { AgroLogoImage } from '../components/AgroLogoImage';
import { OrganicBackground } from '../components/OrganicBackground';
import { PlantChart } from '../components/PlantChart';
import { StatusCard } from '../components/StatusCard';
import { AppIcon, IconBadge } from '../components/Icons';
import { useNavigation } from '../navigation/NavigationContext';
import { useUser } from '../constants/UserContext';
import { useCarritos } from '../constants/CarritosContext';
import { useNotifications } from '../constants/NotificationContext';
import { useSettings } from '../constants/SettingsContext';

/**
 * HomeScreen Component
 * Módulo de Inicio S.I.A.R. Mobile (Pixel-Perfect Responsive Implementation)
 */
export const HomeScreen = () => {
  const { navigate } = useNavigation();
  const { userName } = useUser();
  const { slots, conectarCarrito, desconectarCarrito } = useCarritos();
  const { addNotification } = useNotifications();
  const { profileImage, theme } = useSettings();

  // Live streaming chart state
  const [isLive, setIsLive] = useState(true);

  // Bluetooth System State
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [showBluetoothOffModal, setShowBluetoothOffModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [pendingSlotId, setPendingSlotId] = useState(null);
  const [buscandoBT, setBuscandoBT] = useState(false);

  // Available Bluetooth Prototipos for scanning
  const availablePrototypes = [
    { id: 'bt-robot-alpha', name: 'S.I.A.R. Robot Alpha (BT-01)', initialKwh: '31.5' },
    { id: 'bt-robot-beta', name: 'S.I.A.R. Robot Beta (BT-02)', initialKwh: '19.4' },
    { id: 'bt-robot-gamma', name: 'S.I.A.R. Robot Gamma (BT-03)', initialKwh: '24.0' },
  ];

  // Simula un escaneo Bluetooth y, al terminar, muestra la lista de dispositivos
  const iniciarEscaneoBT = () => {
    setBuscandoBT(true);
    setTimeout(() => setBuscandoBT(false), 2000);
  };

  // Handle click on "conectar nuevo dispositivo" slot (recibe el slot destino)
  const handleSlotPress = (slotId) => {
    setPendingSlotId(slotId);
    if (!isBluetoothOn) {
      setShowBluetoothOffModal(true);
    } else {
      setShowScannerModal(true);
      iniciarEscaneoBT();
    }
  };

  // Handle turning on Bluetooth from Modal 1
  const handleActivateBluetooth = () => {
    setIsBluetoothOn(true);
    setShowBluetoothOffModal(false);
    setTimeout(() => {
      setShowScannerModal(true);
      iniciarEscaneoBT();
    }, 250);
  };

  // Handle connecting a scanned device (crea el carrito en el slot pendiente)
  const handleConnectDevice = (prototype) => {
    conectarCarrito(pendingSlotId, {
      deviceId: prototype.id,
      velocidad: parseFloat(prototype.initialKwh) || 0,
    });
    addNotification(
      'Robot Conectado',
      `Se estableció conexión con ${prototype.name} por Bluetooth.`,
      'success'
    );
    setShowScannerModal(false);
    setPendingSlotId(null);
  };

  // Desconexión por Bluetooth (click en el botón de desconectar del StatusCard)
  const handleDisconnectRobot = (slot) => {
    desconectarCarrito(slot.id);
    addNotification(
      'Robot Desconectado',
      `${slot.carrito?.nombre ?? 'El vehículo S.I.A.R.'} perdió la conexión Bluetooth.`,
      'danger'
    );
  };

  // Datos sincronizados para la gráfica de barras (carr 1..4)
  const chartData = slots.map((slot) => ({
    id: `carr${slot.id}`,
    label: `carr ${slot.id}`,
    value: slot.carrito && slot.carrito.conectado ? slot.carrito.plantas : 0,
    conectado: Boolean(slot.carrito && slot.carrito.conectado),
  }));

  // Tarjeta del grid según el estado del slot:
  // activa (telemetría en vivo) / desconectada (0 km/h) / vacía (+) 
  const renderSlotCard = (slot) => {
    const handleConnectNew = () => handleSlotPress(slot.id);

    if (!slot.carrito) {
      return <StatusCard isEmpty={true} onConnectNew={handleConnectNew} />;
    }

    if (!slot.carrito.conectado) {
      return (
        <StatusCard
          device={slot.carrito}
          disconnected={true}
          onConnectNew={handleConnectNew}
        />
      );
    }

    return (
      <StatusCard
        device={slot.carrito}
        onPress={() =>
          navigate('ConsolaManual', { carId: slot.id, zona: slot.carrito.zona })
        }
        onDisconnect={() => handleDisconnectRobot(slot)}
      />
    );
  };

  // Extract initials from user name
  const getInitials = (name) => {
    if (!name) return 'RM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <OrganicBackground showTop={true} showBottom={true}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bg}
        />

        {/* 2. SECCIÓN SUPERIOR: CABECERA Y USUARIO (LAYOUT RESPONSIVE MOBILE) */}
        <View style={styles.header}>
          {/* Bloque Izquierdo: Avatar circular (50x50) + Columna de texto vertical */}
          <View style={styles.headerLeftBlock}>
            <TouchableOpacity
              style={styles.avatarCircle}
              activeOpacity={0.85}
              onPress={() => navigate('Profile')}
            >
              <View style={styles.avatarInner}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarInitials}>{getInitials(userName)}</Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.textColumn}>
              <Text style={[styles.greetingText, { color: theme.textPrimary }]} numberOfLines={1} ellipsizeMode="tail">
                Hola {userName}
              </Text>
              <Text style={[styles.dateSubtitleText, { color: theme.textSecondary }]}>
                Mayo,27-2026
              </Text>
            </View>
          </View>

          {/* Bloque Derecho: Isotipo Oficial S.I.A.R. (sobre ola verde claro) */}
          <View style={styles.headerRightBlock}>
            <AgroLogoImage size={34} onDark style={styles.logoEmblem} />
          </View>
        </View>

        {/* SCROLLABLE HOME CONTENT */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Access to Robotics Manual Control */}
          <TouchableOpacity
            style={[
              styles.consoleQuickBar,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
            ]}
            activeOpacity={0.88}
            onPress={() => navigate('ConsolaManual')}
          >
            <View style={styles.consoleLeft}>
              <IconBadge size={30} bg={Colors.mintLight}>
                <AppIcon name="joystick" size={16} color={theme.primary} />
              </IconBadge>
              <Text style={[styles.consoleQuickText, { color: theme.textPrimary }]}>
                Consola de Control Manual
              </Text>
            </View>
            <View style={styles.consoleRight}>
              <Text style={[styles.consoleActionLabel, { color: theme.primary }]}>Entrar</Text>
              <AppIcon name="arrow-right" size={13} color={theme.primary} />
            </View>
          </TouchableOpacity>

          {/* 3. SECCIÓN CENTRAL: TARJETA DE GRÁFICA "CANTIDAD DE PLANTAS REVISADAS" */}
          <PlantChart
            isLive={isLive}
            onToggleLive={() => setIsLive(!isLive)}
            data={chartData}
          />

          {/* 4. SECCIÓN INTERMEDIA: GRID DE SLOTS (CARROS) EN 2x2 */}
          <View style={styles.gridContainer}>
            {/* Row 1 */}
            <View style={styles.gridRow}>
              <View style={styles.gridCell}>{renderSlotCard(slots[0])}</View>
              <View style={styles.gridCell}>{renderSlotCard(slots[1])}</View>
            </View>

            {/* Row 2 */}
            <View style={styles.gridRow}>
              <View style={styles.gridCell}>{renderSlotCard(slots[2])}</View>
              <View style={styles.gridCell}>{renderSlotCard(slots[3])}</View>
            </View>
          </View>

          {/* Extra spacing for Bottom Tab Bar */}
          <View style={{ height: 95 }} />
        </ScrollView>

        {/* 5. MODAL 1: SOLICITUD DE ACTIVACIÓN DE BLUETOOTH (BLUETOOTH OFF) */}
        <Modal
          visible={showBluetoothOffModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowBluetoothOffModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.bluetoothOffCard}>
              {/* Bluetooth Icon in mint halo */}
              <View style={styles.bluetoothHalo}>
                <AppIcon name="bluetooth" size={36} color={Colors.primaryDark} />
              </View>

              {/* Descriptive Text */}
              <Text style={styles.bluetoothOffText}>
                Activa el modo Bluetooth para poder conectar el dispositivo
              </Text>

              {/* Green Rounded Action Button */}
              <TouchableOpacity
                style={styles.activateBluetoothBtn}
                activeOpacity={0.85}
                onPress={handleActivateBluetooth}
              >
                <Text style={styles.activateBtnText}>Activar</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.cancelTextBtn}
                onPress={() => setShowBluetoothOffModal(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 5. MODAL 2: CONEXIÓN BLUETOOTH (ESCANEO + SELECCIÓN DE DISPOSITIVO) */}
        <Modal
          visible={showScannerModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowScannerModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>📶 Conectar por Bluetooth</Text>
              <Text style={styles.modalSub}>Buscando carritos disponibles cercanos...</Text>

              {buscandoBT ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="large" color="#2E7D32" />
                  <Text style={styles.loadingText}>Escaneando dispositivos...</Text>
                </View>
              ) : (
                <View style={styles.deviceList}>
                  {availablePrototypes.map((dev) => (
                    <TouchableOpacity
                      key={dev.id}
                      style={styles.deviceItem}
                      activeOpacity={0.85}
                      onPress={() => handleConnectDevice(dev)}
                    >
                      <Text style={styles.deviceName}>{dev.name}</Text>
                      <Text style={styles.connectLink}>Conectar</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.closeModalBtn}
                activeOpacity={0.8}
                onPress={() => setShowScannerModal(false)}
              >
                <Text style={styles.closeModalText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </OrganicBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  // Responsive Mobile Header Layout
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    zIndex: 10,
  },
  headerLeftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.pastelGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#F57C00',
    ...Shadows.soft,
  },
  avatarInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.3,
  },
  dateSubtitleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
    marginTop: 1,
  },
  headerRightBlock: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmblem: {
    width: 64,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
  },
  consoleQuickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EDF3EB',
    ...Shadows.soft,
  },
  consoleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consoleQuickText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  consoleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  consoleActionLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.leafGreen,
  },
  // Grid 2x2 Layout
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCell: {
    flex: 1,
  },
  // Modal 1: Bluetooth Off Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  bluetoothOffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    ...Shadows.strong,
  },
  bluetoothHalo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.mintLight,
    borderWidth: 2,
    borderColor: Colors.pastelGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bluetoothOffText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.primaryDark,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  activateBluetoothBtn: {
    backgroundColor: '#C8E6C9',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  activateBtnText: {
    color: Colors.primaryDark,
    fontSize: 14.5,
    fontWeight: '800',
  },
  cancelTextBtn: {
    marginTop: 12,
    padding: 4,
  },
  cancelText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  // Modal 2: Conexión Bluetooth
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxWidth: 360,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F3818',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 16,
  },
  loadingBox: {
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#2E7D32',
    fontSize: 13,
  },
  deviceList: {
    marginVertical: 10,
    gap: 8,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4FBF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  deviceName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    paddingRight: 8,
  },
  connectLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  closeModalBtn: {
    marginTop: 14,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
  },
  closeModalText: {
    color: '#555555',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default HomeScreen;
