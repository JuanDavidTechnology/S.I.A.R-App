import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { OrganicBackground } from '../components/OrganicBackground';
import { AppIcon } from '../components/Icons';
import { useCarritos } from '../constants/CarritosContext';
import { useNotifications } from '../constants/NotificationContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../services/api';

/* ========== Utilidades de bloques horarios (AM/PM) ========== */
const formatHora = (h24) => {
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h = h24 % 12 || 12;
  return `${h}:00 ${ampm}`;
};

const formatHoraBloque = (date) =>
  `${formatHora(date.getHours())} - ${formatHora((date.getHours() + 1) % 24)}`;

const calcularEstadoInforme = (registro) => {
  if (registro.estado) return registro.estado;
  const bateria = Number(registro.bateria ?? 0);
  if (bateria <= 20) return 'Batería baja';
  if (Number(registro.anomalias ?? 0) > 0) return 'Anomalía leve';
  return 'Óptimo';
};

const formatHoraInforme = (value) => {
  if (typeof value === 'string' && /AM|PM/i.test(value)) return value;
  const ts = typeof value === 'number' ? value : new Date(value).getTime();
  return formatHoraBloque(new Date(Number.isFinite(ts) ? ts : Date.now()));
};

const normalizeInformes = (lista, carritoActivo) =>
  lista.map((item) => ({
    id: String(item.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    carrId: item.carrId ?? item.carrito_id ?? item.carId ?? carritoActivo,
    hora: formatHoraInforme(item.hora ?? item.hora_bloque ?? item.created_at ?? item.timestamp),
    plantas: Number(item.plantas ?? 0),
    tempPromedio: Number(item.tempPromedio ?? item.temp_promedio ?? item.temp ?? 0),
    anomalias: Number(item.anomalias ?? 0),
    bateria: Number(item.bateria ?? 0),
    estado: calcularEstadoInforme(item),
    zona: item.zona ?? 'Zona 1',
  }));

/**
 * ReportsScreen Component
 * Módulo de Informes y Estadísticas Agronómicas de S.I.A.R.
 */
export const ReportsScreen = () => {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'daily', 'anomalies', 'energy'

  // ============ Informe Recolectado En Vivo (Por Hora) ============
  const { slots } = useCarritos();
  const { addNotification } = useNotifications();

  const [carritoActivo, setCarritoActivo] = useState('carr-1');
  const [exportVisible, setExportVisible] = useState(false);

  // Carritos registrados (Carr-1..N con su zona)
  const robots = (() => {
    const base = slots
      .map((slot, idx) =>
        slot.carrito
          ? {
              id: `carr-${idx + 1}`,
              nombre: `Carr ${idx + 1}`,
              zona: slot.carrito.zona,
            }
          : null
      )
      .filter(Boolean);
    if (base.length) return base;
    return [
      { id: 'carr-1', nombre: 'Carr 1', zona: 'Zona 1' },
      { id: 'carr-2', nombre: 'Carr 2', zona: 'Zona 2' },
      { id: 'carr-3', nombre: 'Carr 3', zona: 'Zona 3' },
    ];
  })();

  const robotSeleccionado = robots.find((r) => r.id === carritoActivo) ?? robots[0];

  const [informesPorHora, setInformesPorHora] = useState([]);

  // Cargar el historial real de informes (MySQL) filtrado por carrito
  useEffect(() => {
    let mounted = true;

    const cargarInformes = async () => {
      try {
        const endpoint = `/reports/list.php?carrito_id=${encodeURIComponent(carritoActivo)}`;
        const payload = await api.get(endpoint);
        if (!mounted) return;
        const lista = Array.isArray(payload)
          ? payload
          : (payload && (payload.reports || payload.data || payload.list)) || [];
        if (Array.isArray(lista)) {
          setInformesPorHora(normalizeInformes(lista, carritoActivo));
        }
      } catch (_error) {
        if (mounted) setInformesPorHora([]);
      }
    };

    cargarInformes();
    return () => {
      mounted = false;
    };
  }, [carritoActivo]);

  const informesFiltrados = informesPorHora.filter((r) => r.carrId === carritoActivo);

  const generarCSV = () => {
    const lineas = [
      'Informe Resumen S.I.A.R.',
      `Carrito: ${robotSeleccionado?.nombre ?? carritoActivo} · ${robotSeleccionado?.zona ?? ''}`,
      `Exportado: ${new Date().toLocaleString()}`,
      '',
      'Hora, Plantas, Temp (°C), Anomalías, Batería (%), Estado',
      ...informesFiltrados.map(
        (r) =>
          `${r.hora}, ${r.plantas}, ${r.tempPromedio}, ${r.anomalias}, ${r.bateria}%, ${r.estado}`
      ),
    ];
    return lineas.join('\n');
  };

  // Filtro por categoría aplicado a las lecturas horarias del carrito activo
  const informesVisibles = informesFiltrados.filter((r) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'anomalies')
      return r.anomalias > 0 || r.estado !== 'Óptimo';
    if (activeCategory === 'energy') return r.bateria < 50;
    return true;
  });

  return (
    <OrganicBackground showTop={true} showBottom={true}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        {/* Screen Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Informes y Reportes</Text>
            <Text style={styles.headerSubtitle}>
              Historial de inspección y analítica de campo
            </Text>
          </View>
        </View>

        {/* Filtros superiores en píldora */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catContainer}
          contentContainerStyle={styles.catContentContainer}
        >
          {[
            { key: 'all', label: 'Todos' },
            { key: 'daily', label: 'Diarios' },
            { key: 'anomalies', label: 'Anomalías' },
            { key: 'energy', label: 'Energía' },
          ].map((cat) => {
            const pillActiva = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                style={[styles.catPill, pillActiva && styles.catPillActive]}
                activeOpacity={0.85}
              >
                <Text style={[styles.catText, pillActiva && styles.catTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* MARCO VERDE CLARO CONTENEDOR */}
          <View style={styles.mainWrapper}>
            {/* ENCABEZADO CON BOTÓN EXPORTAR */}
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mainTitle}>
                  Informes Recolectados (Por Hora)
                </Text>
                <Text style={styles.subTitle}>
                  Reportes por hora recolectados de forma independiente
                </Text>
              </View>
              <TouchableOpacity
                style={styles.exportBtn}
                activeOpacity={0.85}
                onPress={() => setExportVisible(true)}
              >
                <MaterialCommunityIcons name="download" size={16} color="#FFF" />
                <Text style={styles.exportText}>Exportar</Text>
              </TouchableOpacity>
            </View>

            {/* SELECTOR DE CARRITOS EN PÍLDORAS */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.robotSelectorRow}
            >
              {robots.map((robot) => {
                const pillActiva = carritoActivo === robot.id;
                return (
                  <TouchableOpacity
                    key={robot.id}
                    onPress={() => setCarritoActivo(robot.id)}
                    style={[
                      styles.robotBtn,
                      pillActiva ? styles.robotBtnActive : styles.robotBtnInactive,
                    ]}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons
                      name="car"
                      size={18}
                      color={pillActiva ? '#FFF' : '#0F3818'}
                    />
                    <Text style={[styles.robotBtnText, pillActiva && { color: '#FFF' }]}>
                      {robot.nombre} · {robot.zona}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* TARJETAS DE INFORME HÍBRIDAS */}
            {informesVisibles.length > 0 ? (
              informesVisibles.map((registro) => {
                const esOptimo = registro.estado === 'Óptimo';
                const sinDatos = registro.estado === 'Sin datos';
                const esBateriaBaja = registro.estado === 'Batería baja';

                const estadoBg = sinDatos
                  ? '#F1F1F1'
                  : esOptimo
                    ? '#E8F5E9'
                    : '#FFEBEE';
                const estadoColor = sinDatos
                  ? '#666'
                  : esOptimo
                    ? '#2E7D32'
                    : '#D32F2F';
                const estadoIcon = esOptimo
                  ? 'sprout'
                  : 'alert-circle-outline';
                const estadoTexto = sinDatos
                  ? 'Sin datos'
                  : esOptimo
                    ? 'Cultivo saludable'
                    : esBateriaBaja
                      ? 'Batería baja'
                      : 'Anomalía en follaje';
                const numeroCarrito = (registro.carrId ?? carritoActivo).replace(
                  'carr-',
                  ''
                );

                return (
                  <View key={registro.id} style={styles.card}>
                    {/* LÍNEA 1: HORA + BATERÍA + DESCARGA */}
                    <View style={styles.cardTopRow}>
                      <View style={styles.timeBadge}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={16}
                          color="#0F3818"
                        />
                        <Text style={styles.timeText}>{registro.hora}</Text>
                      </View>
                      <View style={styles.rightTopGroup}>
                        <View style={styles.batteryBadge}>
                          <MaterialCommunityIcons
                            name={
                              registro.bateria <= 5
                                ? 'battery-alert'
                                : 'battery-high'
                            }
                            size={16}
                            color={registro.bateria <= 5 ? '#D32F2F' : '#2E7D32'}
                          />
                          <Text
                            style={[
                              styles.batteryText,
                              {
                                color:
                                  registro.bateria <= 5
                                    ? '#D32F2F'
                                    : '#2E7D32',
                              },
                            ]}
                          >
                            {registro.bateria}%
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.downloadIconBtn}
                          onPress={() => setExportVisible(true)}
                        >
                          <MaterialCommunityIcons
                            name="download-outline"
                            size={16}
                            color="#0F3818"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* LÍNEA 2: 4 MÉTRICAS COMPACTAS */}
                    <View style={styles.metricsBox}>
                      <View style={styles.metricItem}>
                        <Text style={styles.mLabel}>Dispositivo</Text>
                        <Text style={styles.mVal}>Carro {numeroCarrito}</Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.metricItem}>
                        <Text style={styles.mLabel}>Plantas</Text>
                        <Text style={styles.mVal}>{registro.plantas} pl</Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.metricItem}>
                        <Text style={styles.mLabel}>Anomalías</Text>
                        <Text
                          style={[
                            styles.mVal,
                            {
                              color:
                                registro.anomalias > 0
                                  ? '#D32F2F'
                                  : '#0F3818',
                            },
                          ]}
                        >
                          {registro.anomalias}
                        </Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.metricItem}>
                        <Text style={styles.mLabel}>Consumo</Text>
                        <Text style={styles.mVal}>
                          {((100 - registro.bateria) * 0.015).toFixed(2)} Kwh
                        </Text>
                      </View>
                    </View>

                    {/* LÍNEA 3: ESTADO / DIAGNÓSTICO */}
                    <View style={styles.statusRow}>
                      <View style={styles.carrilBadge}>
                        <Text style={styles.carrilText}>
                          Carril: carr {numeroCarrito}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBox,
                          { backgroundColor: estadoBg, flex: 1 },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={estadoIcon}
                          size={18}
                          color={estadoColor}
                        />
                        <Text style={[styles.statusText, { color: estadoColor }]}>
                          {estadoTexto}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.liveEmpty}>
                Sin lecturas que coincidan con el filtro de{' '}
                {robotSeleccionado?.nombre ?? carritoActivo}.
              </Text>
            )}

          </View>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Modal de exportación del informe resumen (CSV) */}
        <Modal
          animationType="slide"
          transparent
          visible={exportVisible}
          onRequestClose={() => setExportVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.exportModalBox}>
              <View style={styles.exportTitleRow}>
                <Text style={styles.exportTitle}>
                  Informe Resumen — {robotSeleccionado?.nombre ?? carritoActivo} ·{' '}
                  {robotSeleccionado?.zona ?? ''}
                </Text>
                <TouchableOpacity
                  style={styles.exportModalClose}
                  onPress={() => setExportVisible(false)}
                >
                  <Text style={styles.exportModalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.exportSubtitle}>
                {informesFiltrados.length} bloques horarios • Vista previa del archivo (PDF / CSV)
              </Text>
              <ScrollView style={styles.csvBox} nestedScrollEnabled>
                <Text style={styles.csvText}>{generarCSV()}</Text>
              </ScrollView>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setExportVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Cerrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDownloadBtn}
                  onPress={() => {
                    addNotification(
                      'Informe Descargado',
                      'El informe en PDF del cultivo fue guardado con éxito.',
                      'success'
                    );
                    alert(
                      `Informe resumido de ${robotSeleccionado?.nombre ?? carritoActivo} exportado (PDF/CSV). Se incluyen ${informesFiltrados.length} bloques horarios.`
                    );
                    setExportVisible(false);
                  }}
                >
                  <AppIcon name="download" size={16} color="#FFFFFF" />
                  <Text style={styles.modalDownloadText}>Descargar</Text>
                </TouchableOpacity>
              </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  catContainer: {
    maxHeight: 45,
    marginBottom: 12,
  },
  catContentContainer: {
    alignItems: 'center',
    paddingRight: 10,
  },
  catPill: {
    height: 36,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D0E0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catPillActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  catText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B3B1A',
  },
  catTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
  },
  mainWrapper: {
    backgroundColor: '#E2EFE0',
    borderRadius: 24,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F3818',
  },
  subTitle: {
    fontSize: 11,
    color: '#3B5B3E',
    marginTop: 2,
  },
  exportText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  robotSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
  },
  robotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  robotBtnActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  robotBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BBD8B0',
  },
  robotBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F3818',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F3818',
  },
  rightTopGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  batteryText: {
    fontSize: 12,
    fontWeight: '800',
  },
  downloadIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2EFE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9F7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  mLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7A6E',
    marginBottom: 3,
  },
  mVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F3818',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E0E0E0',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  carrilBadge: {
    backgroundColor: '#E2EFE0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  carrilText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F3818',
  },
  // Modal Preview
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalCloseBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modalDownloadBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
    gap: 6,
  },
  modalDownloadText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ---------- Informe En Vivo (Por Hora) ---------- */
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F3818',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  batteryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  liveEmpty: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 14,
  },

  /* ---------- Modal Export ---------- */
  exportModalBox: {
    maxWidth: 340,
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    ...Shadows.strong,
  },
  exportTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exportTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  exportModalClose: {
    padding: 4,
  },
  exportModalCloseText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  exportSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  csvBox: {
    maxHeight: 260,
    backgroundColor: '#0F2417',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  csvText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#C9F2DC',
    lineHeight: 16,
  },
});

export default ReportsScreen;
