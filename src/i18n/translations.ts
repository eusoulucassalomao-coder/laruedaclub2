import { Language } from '../types';

export interface TranslationDictionary {
  langName: string;
  locale: string;
  nav: {
    home: string;
    points: string;
    rewards: string;
    history: string;
    profile: string;
    assistant: string;
    assistantAria: string;
  };
  common: {
    pointsShort: string;
    pointsFull: string;
    close: string;
    cancel: string;
    save: string;
    saving: string;
    loading: string;
    refresh: string;
    copied: string;
    copyCode: string;
    demoNote: string;
    connectionError: string;
    viewAll: string;
    available: string;
    locked: string;
    missingPoints: string; // "{points} pts"
    back: string;
    optional: string;
  };
  pwa: {
    androidTitle: string;
    androidSubtitle: string;
    installAppButton: string;
    continueBrowserButton: string;
    androidManualTitle: string;
    androidManualSteps: [string, string, string];
    deviceSwitchLabel: string;
    iosSafariTitle: string;
    iosSafariSubtitle: string;
    iosSteps: [string, string, string];
    iosOtherTitle: string;
    iosOtherSubtitle: string;
    iosOtherGuide: string;
    desktopBannerTitle: string;
    desktopBannerDesc: string;
    desktopInstallAction: string;
    installedLabel: string;
    offlineBanner: string;
    onlineRestored: string;
    updateAvailable: string;
    updateAction: string;
    installSuccessToast: string;
    installUnavailableToast: string;
  };
  home: {
    greeting: string; // "¡Hola, {name}!"
    subtitle: string;
    currentBalance: string;
    memberCodeLabel: string;
    showCard: string;
    nextRewardProgress: string;
    pointsToNext: string; // "Te faltan {points} pts para tu próxima recompensa"
    rewardGoalReached: string;
    quickActionsTitle: string;
    actionCard: string;
    actionPoints: string;
    actionRewards: string;
    actionRegister: string;
    featuredRewardsTitle: string;
    featuredRewardsSub: string;
    recentActivityTitle: string;
    recentActivitySub: string;
    noRecentActivity: string;
  };
  points: {
    title: string;
    subtitle: string;
    availableBalance: string;
    accumulatedTotal: string;
    redeemedTotal: string;
    progressTitle: string;
    progressNextGoal: string;
    milestonesTitle: string;
    milestoneReached: string;
    milestoneCurrent: string;
    milestoneNext: string;
    howItWorksTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    movementsTitle: string;
    filterAll: string;
    filterEarned: string;
    filterUsed: string;
    emptyMovements: string;
  };
  rewards: {
    title: string;
    subtitle: string;
    yourBalance: string;
    filterAll: string;
    filterAvailable: string;
    filterLocked: string;
    categories: {
      all: string;
      cafe: string;
      bakery: string;
      experiences: string;
      boutique: string;
    };
    emptyStateTitle: string;
    emptyStateDesc: string;
    clearFilters: string;
    detailCost: string;
    detailYourBalance: string;
    detailAfterRedeem: string;
    detailNeeded: string;
    detailTermsTitle: string;
    detailTermsBody: string;
    simulateRedeemBtn: string;
    simulatingRedeem: string;
    insufficientPointsBtn: string;
    voucherTitle: string;
    voucherSubtitle: string;
    voucherCodeLabel: string;
    voucherDemoDisclaimer: string;
    voucherDoneBtn: string;
    items: Record<
      string,
      {
        title: string;
        shortDesc: string;
        fullDesc: string;
      }
    >;
  };
  history: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterEarned: string;
    filterUsed: string;
    filterRedeemed: string;
    typeLabels: {
      earned: string;
      used: string;
      redeemed: string;
    };
    emptyTitle: string;
    emptyDesc: string;
    clearSearch: string;
    viewVoucher: string;
    voucherModalTitle: string;
    entries: Record<string, string>;
  };
  profile: {
    title: string;
    subtitle: string;
    memberIdLabel: string;
    memberSinceLabel: string;
    emailLabel: string;
    birthDateLabel: string;
    favoriteBranchLabel: string;
    editProfileBtn: string;
    editModalTitle: string;
    fullNameLabel: string;
    saveSuccess: string;
    validationError: string;
    languageSectionTitle: string;
    languageSectionDesc: string;
    preferencesTitle: string;
    whatsappTitle: string;
    whatsappDesc: string;
    notificationsTitle: string;
    notificationsDesc: string;
    notificationsPreviewNotice: string;
    settingsTitle: string;
    registerNewAccount: string;
    registerNewAccountDesc: string;
    switchToMaria: string;
    switchToMariaDesc: string;
    resetDemoData: string;
    resetDemoDataDesc: string;
    resetDoneToast: string;
    signOutTitle: string;
    signOutDesc: string;
    installPwaRowTitle: string;
    installPwaRowDesc: string;
    installPwaRowInstalled: string;
    previewsSectionTitle: string;
    previewsSectionDesc: string;
    previewsDisclaimer: string;
    previewTabs: {
      android: string;
      iosSafari: string;
      iosChrome: string;
      notifications: string;
    };
    notifDemoTitle: string;
    notifDemoBody: string;
    notifDemoAllow: string;
    notifDemoLater: string;
    notifDemoAllowedFeedback: string;
    notifDemoLaterFeedback: string;
    androidSimulatedInstalled: string;
    androidResetPreview: string;
  };
  memberCard: {
    title: string;
    subtitle: string;
    presentAtCounter: string;
    codeLabel: string;
    balanceLabel: string;
  };
  registration: {
    title: string;
    subtitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    birthDateLabel: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    whatsappOptInLabel: string;
    whatsappOptInHint: string;
    submitBtn: string;
    submittingBtn: string;
    legalNoticePrefix: string;
    termsLink: string;
    privacyLink: string;
    cookiesLink: string;
    legalConnectorAnd: string;
    errorNameRequired: string;
    errorEmailInvalid: string;
    errorPhoneInvalid: string;
    errorBirthRequired: string;
    errorPasswordShort: string;
    successTitle: string;
    successSubtitle: string;
    successWelcomeBonus: string;
    successContinueBtn: string;
    demoNotice: string;
    consentLabel: string;
    errorConsentRequired: string;
    errorGeneric: string;
    legalDocs: {
      terms: { title: string; body: string[] };
      privacy: { title: string; body: string[] };
      cookies: { title: string; body: string[] };
    };
  };
  assistant: {
    title: string;
    subtitle: string;
    welcomeMessage: string;
    placeholder: string;
    sendAria: string;
    quickCheckMar: string;
    quickCheckSof: string;
    quickBenefits: string;
    quickRegister: string;
    quickInstall: string;
    replyPointsFound: string; // template with {name}, {code}, {points}, {remaining}, {target}, {branch}
    replyPointsUnlocked: string;
    replyCodeNotFound: string;
    replyBenefitsSummary: string;
    replyRegisterGuide: string;
    replyInstallGuide: string;
    replyFallback: string;
    actionViewRewards: string;
    actionOpenRegister: string;
    actionTrySof: string;
    actionOpenPreviews: string;
    demoFooterNote: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  es: {
    langName: 'Español',
    locale: 'es-ES',
    nav: {
      home: 'Inicio',
      points: 'Puntos',
      rewards: 'Beneficios',
      history: 'Historial',
      profile: 'Perfil',
      assistant: 'Asistente',
      assistantAria: 'Abrir asistente virtual de Club La Ruedita',
    },
    common: {
      pointsShort: 'pts',
      pointsFull: 'puntos',
      close: 'Cerrar',
      cancel: 'Cancelar',
      save: 'Guardar cambios',
      saving: 'Guardando...',
      loading: 'Actualizando...',
      refresh: 'Actualizar',
      copied: 'Código copiado',
      copyCode: 'Copiar código',
      demoNote: 'Programa de fidelidad',
      connectionError: 'No pudimos conectar con el club. Revisa tu conexión e inténtalo de nuevo.',
      viewAll: 'Ver todo',
      available: 'Disponible',
      locked: 'Bloqueado',
      missingPoints: 'Faltan {points} pts',
      back: 'Volver',
      optional: 'Opcional',
    },
    pwa: {
      androidTitle: 'Lleva Club La Ruedita en tu teléfono',
      androidSubtitle:
        'Consulta tus puntos, muestra tu código en caja y descubre tus recompensas al instante.',
      installAppButton: 'Instalar aplicación',
      continueBrowserButton: 'Continuar en el navegador',
      androidManualTitle: 'Cómo instalar manualmente en Android',
      androidManualSteps: [
        'Toca el menú de tres puntos (⋮) en la esquina superior de Chrome.',
        'Selecciona «Instalar aplicación» o «Añadir a pantalla de inicio».',
        'Confirma tocando «Instalar» para ver el ícono en tu inicio.',
      ],
      deviceSwitchLabel: 'Guía según tu dispositivo',
      iosSafariTitle: 'Instala Club La Ruedita en tu iPhone',
      iosSafariSubtitle:
        'Sigue estos tres pasos desde Safari para abrir tu tarjeta del club como una aplicación.',
      iosSteps: [
        'Toca el botón Compartir en la barra inferior de Safari.',
        'Desliza hacia abajo y elige «Añadir a pantalla de inicio».',
        'Toca «Añadir» en la esquina superior derecha.',
      ],
      iosOtherTitle: 'Abre Club La Ruedita en Safari',
      iosOtherSubtitle:
        'En iPhone, la instalación directa en la pantalla de inicio funciona únicamente desde Safari.',
      iosOtherGuide:
        'Copia o abre este enlace en Safari y luego toca Compartir → Añadir a pantalla de inicio → Añadir.',
      desktopBannerTitle: 'Instala Club La Ruedita en tu equipo',
      desktopBannerDesc:
        'Accede más rápido a tus puntos y beneficios en una ventana dedicada, incluso sin conexión.',
      desktopInstallAction: 'Instalar app',
      installedLabel: 'Aplicación instalada',
      offlineBanner: 'Sin conexión — Mostrando tus datos guardados en caché.',
      onlineRestored: 'Conexión restablecida — Ya estás en línea nuevamente.',
      updateAvailable: 'Hay una versión actualizada de Club La Ruedita.',
      updateAction: 'Actualizar ahora',
      installSuccessToast: 'Club La Ruedita se instaló correctamente.',
      installUnavailableToast:
        'La instalación automática no está disponible en este navegador. Abre el enlace en Google Chrome actualizado e inténtalo de nuevo.',
    },
    home: {
      greeting: '¡Hola, {name}!',
      subtitle: 'Qué gusto tenerte de vuelta en Club La Ruedita.',
      currentBalance: 'Saldo actual',
      memberCodeLabel: 'Código de socio',
      showCard: 'Mostrar tarjeta',
      nextRewardProgress: 'Progreso a tu próxima recompensa',
      pointsToNext: 'Te faltan {points} pts para alcanzar los {target} pts',
      rewardGoalReached: '¡Superaste tu meta de {target} pts! Tienes recompensas listas.',
      quickActionsTitle: 'Accesos rápidos',
      actionCard: 'Mi tarjeta',
      actionPoints: 'Mis puntos',
      actionRewards: 'Beneficios',
      actionRegister: 'Crear cuenta',
      featuredRewardsTitle: 'Beneficios destacados',
      featuredRewardsSub: 'Canjea tus puntos por experiencias artesanales en tienda.',
      recentActivityTitle: 'Actividad reciente',
      recentActivitySub: 'Tus últimos movimientos en el club.',
      noRecentActivity: 'Aún no tienes movimientos. Tu actividad aparecerá aquí.',
    },
    points: {
      title: 'Tus puntos',
      subtitle: 'Sigue tu saldo acumulado y qué tan cerca estás de tu próxima recompensa.',
      availableBalance: 'Saldo disponible',
      accumulatedTotal: 'Puntos acumulados',
      redeemedTotal: 'Puntos canjeados',
      progressTitle: 'Camino a los {target} puntos',
      progressNextGoal: 'Próxima meta',
      milestonesTitle: 'Niveles de recompensa',
      milestoneReached: 'Alcanzado',
      milestoneCurrent: 'En progreso',
      milestoneNext: 'Próximo',
      howItWorksTitle: 'Cómo sumar y usar tus puntos',
      step1Title: 'Muestra tu código',
      step1Desc: 'Indica tu código de socio en caja en cada visita.',
      step2Title: 'Acumula en cada consumo',
      step2Desc: 'Suma puntos automáticamente con tus cafés y panadería.',
      step3Title: 'Elige tu recompensa',
      step3Desc: 'Canjea tus puntos por beneficios exclusivos en tienda.',
      movementsTitle: 'Movimientos de puntos',
      filterAll: 'Todos',
      filterEarned: 'Ganados',
      filterUsed: 'Utilizados',
      emptyMovements: 'No encontramos movimientos en esta categoría.',
    },
    rewards: {
      title: 'Beneficios y recompensas',
      subtitle: 'Explora el catálogo y simula el canje de tus beneficios favoritos.',
      yourBalance: 'Tu saldo',
      filterAll: 'Todos',
      filterAvailable: 'Disponibles',
      filterLocked: 'Por desbloquear',
      categories: {
        all: 'Todas',
        cafe: 'Cafetería',
        bakery: 'Panadería',
        experiences: 'Experiencias',
        boutique: 'Tienda',
      },
      emptyStateTitle: 'Sin recompensas con estos filtros',
      emptyStateDesc: 'Prueba cambiando el estado o la categoría para ver todo el catálogo.',
      clearFilters: 'Mostrar todo el catálogo',
      detailCost: 'Puntos necesarios',
      detailYourBalance: 'Tu saldo actual',
      detailAfterRedeem: 'Saldo estimado tras canje',
      detailNeeded: 'Puntos faltantes',
      detailTermsTitle: 'Detalles del beneficio',
      detailTermsBody:
        'Válido en La Ruedita presentando el código en caja.',
      simulateRedeemBtn: 'Canjear',
      simulatingRedeem: 'Generando tu código...',
      insufficientPointsBtn: 'Puntos insuficientes',
      voucherTitle: '¡Premio listo!',
      voucherSubtitle: 'Presenta este vale de ejemplo en barra para vivir la experiencia completa.',
      voucherCodeLabel: 'Código de canje',
      voucherDemoDisclaimer:
        'Muestra este código en caja para retirar tu premio. También lo guardamos en tu historial.',
      voucherDoneBtn: 'Listo, volver al catálogo',
      items: {
        'specialty-coffee': {
          title: 'Café de especialidad',
          shortDesc: 'Flat white, latte o cappuccino preparado con granos de origen.',
          fullDesc:
            'Disfruta una taza de nuestro café de especialidad de tueste medio con leche fresca o bebida vegetal a elección, preparado al momento por nuestros baristas.',
        },
        'artisan-pastry': {
          title: 'Dúo de panadería artesanal',
          shortDesc: 'Croissant de mantequilla y rollo trenzado de cardamomo.',
          fullDesc:
            'Recién horneado cada mañana con fermentación lenta de 24 horas: incluye un croissant clásico laminado y un bollo trenzado especiado con cardamomo.',
        },
        'citrus-olive-cake': {
          title: 'Porción de torta cítrica de oliva',
          shortDesc: 'Bizcocho húmedo de aceite de oliva virgen y naranja confitada.',
          fullDesc:
            'Nuestra receta de la casa elaborada con aceite de oliva extra virgen, ralladura de naranja fresca y cobertura artesanal de cítricos confitados.',
        },
        'coffee-beans-bag': {
          title: 'Bolsa de café en grano 250g',
          shortDesc: 'Edición de origen único tostado en pequeños lotes.',
          fullDesc:
            'Llévate a casa 250 gramos de nuestro lote de temporada con notas a cacao, avellana y miel floral. Disponible en grano entero o molido a tu método.',
        },
        'brunch-for-two': {
          title: 'Brunch artesanal para dos',
          shortDesc: 'Tostadas de masa madre, huevos poché, fruta de estación y dos cafés.',
          fullDesc:
            'Una mesa completa para compartir: dos tostadas de pan de masa madre con palta y huevos poché, bowl de frutos frescos y dos espressos o lattes.',
        },
        'olive-canvas-tote': {
          title: 'Bolso de lona La Ruedita',
          shortDesc: 'Algodón orgánico en verde oliva con asas reforzadas color crema.',
          fullDesc:
            'Bolso edición limitada confeccionado en lona de algodón orgánico de alto gramaje, ideal para tus visitas al mercado o tus tardes de café.',
        },
      },
    },
    history: {
      title: 'Historial',
      subtitle: 'Consulta tus puntos recibidos, utilizados y recompensas canjeadas.',
      searchPlaceholder: 'Buscar por descripción o sucursal...',
      filterAll: 'Todos',
      filterEarned: 'Puntos recibidos',
      filterUsed: 'Puntos utilizados',
      filterRedeemed: 'Recompensas canjeadas',
      typeLabels: {
        earned: 'Recibidos',
        used: 'Utilizados',
        redeemed: 'Canjeado',
      },
      emptyTitle: 'No hay registros que coincidan',
      emptyDesc: 'Ajusta el filtro o la búsqueda para ver tus otros movimientos.',
      clearSearch: 'Restablecer filtros',
      viewVoucher: 'Ver código',
      voucherModalTitle: 'Detalle del canje',
      entries: {
        hist_morning_visit_title: 'Desayuno en barra',
        hist_morning_visit_desc: 'Compra registrada con código MAR4821 · Casa Central',
        hist_redeem_coffee_title: 'Canje: Café de especialidad',
        hist_redeem_coffee_desc: 'Recompensa disfrutada en tienda · Vale LR-DEMO-3041',
        hist_weekend_brunch_title: 'Brunch de fin de semana',
        hist_weekend_brunch_desc: 'Mesa para dos con café y panadería · Jardín Botánico',
        hist_bakery_box_title: 'Caja de panadería artesanal',
        hist_bakery_box_desc: 'Selección de cuatro piezas horneadas · Casa Central',
        hist_redeem_pastry_title: 'Canje: Dúo de panadería',
        hist_redeem_pastry_desc: 'Puntos utilizados en recompensa · Vale LR-DEMO-2189',
        hist_welcome_bonus_title: 'Bono de aniversario del club',
        hist_welcome_bonus_desc: 'Puntos de cortesía por ser parte de Club La Ruedita',
        hist_new_member_title: 'Bono de bienvenida (demo)',
        hist_new_member_desc: 'Puntos iniciales por crear tu cuenta de demostración',
        hist_demo_redemption_desc: 'Canje simulado desde el catálogo de beneficios',
      },
    },
    profile: {
      title: 'Mi perfil',
      subtitle: 'Administra tus datos personales, idioma y vistas previas.',
      memberIdLabel: 'ID de cliente',
      memberSinceLabel: 'Socio desde',
      emailLabel: 'Correo electrónico',
      birthDateLabel: 'Fecha de nacimiento',
      favoriteBranchLabel: 'Sucursal preferida',
      editProfileBtn: 'Editar datos',
      editModalTitle: 'Editar datos del perfil',
      fullNameLabel: 'Nombre completo',
      saveSuccess: 'Tus preferencias se guardaron.',
      validationError: 'Completa tu nombre y un correo electrónico válido.',
      languageSectionTitle: 'Idioma de la aplicación',
      languageSectionDesc: 'Cambia el idioma de todos los textos, menús y asistente.',
      preferencesTitle: 'Preferencias y comunicaciones',
      whatsappTitle: 'Novedades por WhatsApp',
      whatsappDesc: 'Recibir campañas y promociones del club por WhatsApp (opcional).',
      notificationsTitle: 'Avisos de recompensas (próximamente)',
      notificationsDesc:
        'Preferencia visual preparada para futuras alertas. No solicita permisos reales.',
      notificationsPreviewNotice:
        'Preferencia visual guardada solo en modo demostración. No activa notificaciones reales.',
      settingsTitle: 'Cuenta y aplicación',
      registerNewAccount: 'Probar flujo de registro',
      registerNewAccountDesc: 'Crea una cuenta ficticia para probar el alta de nuevos socios.',
      switchToMaria: 'Volver al perfil de María Rodríguez (MAR4821)',
      switchToMariaDesc: 'Restaura la cuenta principal de demostración con 850 puntos.',
      resetDemoData: 'Restablecer datos de demostración',
      resetDemoDataDesc: 'Vuelve a cargar el saldo inicial de 850 puntos y el historial base.',
      resetDoneToast: 'Datos de demostración restablecidos.',
      signOutTitle: 'Salir de esta cuenta',
      signOutDesc: 'Cierra tu sesión en este dispositivo. Tus puntos siguen guardados en el club.',
      installPwaRowTitle: 'Instalar aplicación en este dispositivo',
      installPwaRowDesc: 'Agrega Club La Ruedita a tu pantalla de inicio o escritorio.',
      installPwaRowInstalled: 'Ya estás usando la versión instalada.',
      previewsSectionTitle: 'Vista previa de pantallas',
      previewsSectionDesc:
        'Explora de forma interactiva cómo ven Club La Ruedita los clientes en cada dispositivo.',
      previewsDisclaimer:
        'Simulación visual interactiva: no solicita permisos reales del sistema.',
      previewTabs: {
        android: 'Android',
        iosSafari: 'iPhone Safari',
        iosChrome: 'iPhone Chrome',
        notifications: 'Notificaciones',
      },
      notifDemoTitle: '¿Activar avisos de Club La Ruedita?',
      notifDemoBody:
        'Te avisaremos cuando alcances una nueva recompensa o haya un beneficio especial de temporada.',
      notifDemoAllow: 'Permitir (Demo)',
      notifDemoLater: 'Ahora no',
      notifDemoAllowedFeedback:
        'Vista previa confirmada: así se verá el estado activo cuando las notificaciones estén conectadas.',
      notifDemoLaterFeedback:
        'Vista previa omitida: el cliente puede activar esta preferencia en cualquier momento.',
      androidSimulatedInstalled: '¡Simulación lista! Así confirma Android que la app se añadió al inicio.',
      androidResetPreview: 'Ver pantalla inicial de nuevo',
    },
    memberCard: {
      title: 'Tarjeta de socio',
      subtitle: 'Muéstrala en caja antes de pagar para sumar o canjear puntos.',
      presentAtCounter: 'Presentar en sucursal',
      codeLabel: 'Código de identificación',
      balanceLabel: 'Puntos disponibles',
    },
    registration: {
      title: 'Únete a Club La Ruedita',
      subtitle: 'Crea tu perfil de demostración en segundos y empieza a disfrutar beneficios.',
      fullNameLabel: 'Nombre completo',
      fullNamePlaceholder: 'Ej. Lucía Fernández',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'lucia@ejemplo.com',
      phoneLabel: 'Teléfono',
      phonePlaceholder: 'Ej. +54 9 376 123 4567',
      birthDateLabel: 'Fecha de nacimiento',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Mínimo 6 caracteres',
      whatsappOptInLabel: 'Quiero recibir novedades y promociones por WhatsApp',
      whatsappOptInHint: 'Opcional · Puedes cambiarlo cuando quieras desde tu perfil.',
      submitBtn: 'Crear cuenta',
      submittingBtn: 'Creando perfil...',
      legalNoticePrefix: 'Al continuar, confirmas que revisaste nuestros',
      termsLink: 'Términos de Uso',
      privacyLink: 'Política de Privacidad',
      cookiesLink: 'Política de Cookies',
      legalConnectorAnd: 'y',
      errorNameRequired: 'Ingresa tu nombre y apellido.',
      errorEmailInvalid: 'Ingresa un correo electrónico válido.',
      errorPhoneInvalid: 'Ingresa un teléfono válido.',
      errorBirthRequired: 'Selecciona tu fecha de nacimiento.',
      errorPasswordShort: 'La contraseña debe tener al menos 6 caracteres.',
      successTitle: '¡Ya eres socio!',
      successSubtitle: 'Ya puedes explorar la aplicación con tu nuevo perfil y tu código de socio.',
      successWelcomeBonus: 'Ya sumamos tus puntos de bienvenida.',
      successContinueBtn: 'Entrar a mi club',
      demoNotice: 'Registro de demostración: tus datos se guardan solo localmente en este navegador.',
      consentLabel: 'Acepto que Club La Ruedita use mis datos para administrar mi cuenta y me envíe mensajes por WhatsApp.',
      errorConsentRequired: 'Para unirte al club necesitas aceptar este permiso.',
      errorGeneric: 'No pudimos completar tu registro. Inténtalo de nuevo.',
      legalDocs: {
        terms: {
          title: 'Términos de Uso',
          body: ['Este documento está en revisión. Consulta en el local la versión vigente.'],
        },
        privacy: {
          title: 'Política de Privacidad',
          body: ['Este documento está en revisión. Consulta en el local la versión vigente.'],
        },
        cookies: {
          title: 'Política de Cookies',
          body: ['Este documento está en revisión. Consulta en el local la versión vigente.'],
        },
      },
    },
    assistant: {
      title: 'Asistente de Club La Ruedita',
      subtitle: 'Te ayudo con tus puntos, beneficios y registro',
      welcomeMessage:
        '¡Hola! Soy el asistente de Club La Ruedita. Escribe tu código de socio para consultar tus puntos, pregúntame por los premios o crea tu cuenta.',
      placeholder: 'Escribe un código (MAR4821, SOF4821) o tu consulta...',
      sendAria: 'Enviar mensaje',
      quickCheckMar: 'Consultar MAR4821',
      quickCheckSof: 'Consultar SOF4821',
      quickBenefits: 'Ver beneficios disponibles',
      quickRegister: 'Simular registro',
      quickInstall: 'Cómo instalar la app',
      replyPointsFound:
        '¡Hola, {name}! Tu código {code} tiene {points} puntos. Te faltan {remaining} para tu próximo premio ({target} puntos).',
      replyPointsUnlocked:
        'Encontré la cuenta de {name} ({code}).\n\n• Saldo actual: {points} puntos\n• ¡Excelente noticia! Ya tiene disponibles recompensas como Café de especialidad, Bolsa de café en grano (1.000 pts) y Brunch artesanal para dos (1.200 pts).\n• Sucursal habitual: {branch}',
      replyCodeNotFound:
        'No encontré el código {code}. Revísalo e inténtalo de nuevo.',
      replyBenefitsSummary:
        'Con tus {points} puntos puedes canjear {count} premios ahora mismo. ¿Quieres verlos?',
      replyRegisterGuide:
        'Unirte es rápido: nombre, celular con código de área y fecha de nacimiento. ¿Abro el formulario?',
      replyInstallGuide:
        'Puedes instalar Club La Ruedita en segundos:\n• En Android: toca el botón amarillo «Instalar aplicación» o usa el menú de Chrome.\n• En iPhone: abre en Safari y toca Compartir → Añadir a pantalla de inicio → Añadir.\n\nTambién puedes ver la vista previa visual de cada pantalla en tu Perfil.',
      replyFallback:
        '¡Con gusto te ayudo! Puedes escribir un código de demostración como MAR4821 o SOF4821 para consultar puntos, preguntarme sobre beneficios disponibles o probar el flujo de registro.',
      actionViewRewards: 'Ir a Beneficios',
      actionOpenRegister: 'Abrir formulario de registro',
      actionTrySof: 'Consultar SOF4821',
      actionOpenPreviews: 'Ver vistas previas de instalación',
      demoFooterNote: 'Asistente del club. Consulta tus puntos con tu código de socio.',
    },
  },

  en: {
    langName: 'English',
    locale: 'en-US',
    nav: {
      home: 'Home',
      points: 'Points',
      rewards: 'Rewards',
      history: 'History',
      profile: 'Profile',
      assistant: 'Assistant',
      assistantAria: 'Open Club La Ruedita virtual assistant',
    },
    common: {
      pointsShort: 'pts',
      pointsFull: 'points',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save changes',
      saving: 'Saving...',
      loading: 'Updating...',
      refresh: 'Refresh',
      copied: 'Code copied',
      copyCode: 'Copy code',
      demoNote: 'Loyalty program',
      connectionError: 'We could not reach the club. Check your connection and try again.',
      viewAll: 'View all',
      available: 'Available',
      locked: 'Locked',
      missingPoints: '{points} pts away',
      back: 'Back',
      optional: 'Optional',
    },
    pwa: {
      androidTitle: 'Carry Club La Ruedita on your phone',
      androidSubtitle:
        'Check your points balance, present your member code at the counter, and unlock rewards effortlessly.',
      installAppButton: 'Install app',
      continueBrowserButton: 'Continue in browser',
      androidManualTitle: 'How to install manually on Android',
      androidManualSteps: [
        'Tap the three-dot menu (⋮) in the top corner of Chrome.',
        'Select "Install app" or "Add to Home screen".',
        'Confirm by tapping "Install" to add the icon to your home screen.',
      ],
      deviceSwitchLabel: 'Choose your device',
      iosSafariTitle: 'Install Club La Ruedita on iPhone',
      iosSafariSubtitle:
        'Follow these three steps in Safari to launch your membership card just like an app.',
      iosSteps: [
        'Tap the Share icon in Safari’s bottom toolbar.',
        'Scroll down and choose "Add to Home Screen".',
        'Tap "Add" in the upper-right corner.',
      ],
      iosOtherTitle: 'Open Club La Ruedita in Safari',
      iosOtherSubtitle:
        'On iPhone, adding the app directly to your Home Screen is only supported through Safari.',
      iosOtherGuide:
        'Open this page in Safari, then tap Share → Add to Home Screen → Add.',
      desktopBannerTitle: 'Install Club La Ruedita on your computer',
      desktopBannerDesc:
        'Launch your loyalty pass in a dedicated window with instant offline access.',
      desktopInstallAction: 'Install app',
      installedLabel: 'App installed',
      offlineBanner: 'You are offline — Showing cached membership details.',
      onlineRestored: 'Back online — Connection restored.',
      updateAvailable: 'A newer version of Club La Ruedita is ready.',
      updateAction: 'Update now',
      installSuccessToast: 'Club La Ruedita has been installed.',
      installUnavailableToast:
        'Automatic installation is unavailable in this browser. Open the link in the latest Google Chrome and try again.',
    },
    home: {
      greeting: 'Hello, {name}!',
      subtitle: 'Lovely to welcome you back to Club La Ruedita.',
      currentBalance: 'Current balance',
      memberCodeLabel: 'Member code',
      showCard: 'Show card',
      nextRewardProgress: 'Progress to your next reward',
      pointsToNext: '{points} pts left to reach {target} pts',
      rewardGoalReached: 'You passed your {target} pts milestone! New rewards await.',
      quickActionsTitle: 'Quick access',
      actionCard: 'My card',
      actionPoints: 'My points',
      actionRewards: 'Rewards',
      actionRegister: 'Sign up',
      featuredRewardsTitle: 'Featured benefits',
      featuredRewardsSub: 'Redeem your points for handcrafted café & bakery treats.',
      recentActivityTitle: 'Recent activity',
      recentActivitySub: 'Your latest club movements.',
      noRecentActivity: 'No activity yet. Your activity will appear here.',
    },
    points: {
      title: 'Your points',
      subtitle: 'Track your accumulated balance and how close you are to your next reward.',
      availableBalance: 'Available balance',
      accumulatedTotal: 'Total earned',
      redeemedTotal: 'Points redeemed',
      progressTitle: 'Journey to {target} points',
      progressNextGoal: 'Next goal',
      milestonesTitle: 'Reward milestones',
      milestoneReached: 'Unlocked',
      milestoneCurrent: 'In progress',
      milestoneNext: 'Upcoming',
      howItWorksTitle: 'How earning & redeeming works',
      step1Title: 'Show your code',
      step1Desc: 'Share your member ID at the counter on every visit.',
      step2Title: 'Earn on every order',
      step2Desc: 'Collect points automatically with your coffee and pastries.',
      step3Title: 'Enjoy rewards',
      step3Desc: 'Redeem your points for exclusive artisanal perks.',
      movementsTitle: 'Points activity',
      filterAll: 'All',
      filterEarned: 'Earned',
      filterUsed: 'Used',
      emptyMovements: 'No movements found in this category.',
    },
    rewards: {
      title: 'Benefits & rewards',
      subtitle: 'Browse the reward catalog and try a sample redemption.',
      yourBalance: 'Your balance',
      filterAll: 'All',
      filterAvailable: 'Available',
      filterLocked: 'Locked',
      categories: {
        all: 'All',
        cafe: 'Coffee Bar',
        bakery: 'Bakery',
        experiences: 'Experiences',
        boutique: 'Boutique',
      },
      emptyStateTitle: 'No rewards match these filters',
      emptyStateDesc: 'Switch availability or category filters to explore the full catalog.',
      clearFilters: 'Show full catalog',
      detailCost: 'Points required',
      detailYourBalance: 'Your current balance',
      detailAfterRedeem: 'Estimated balance after',
      detailNeeded: 'Points needed',
      detailTermsTitle: 'Reward details',
      detailTermsBody:
        'Valid at La Ruedita by showing the code at the register.',
      simulateRedeemBtn: 'Redeem',
      simulatingRedeem: 'Generating your code...',
      insufficientPointsBtn: 'Not enough points',
      voucherTitle: 'Reward ready!',
      voucherSubtitle: 'Show this sample voucher at the bar to preview the full member flow.',
      voucherCodeLabel: 'Redemption code',
      voucherDemoDisclaimer:
        'Show this code at the register to collect your reward. We also keep it in your history.',
      voucherDoneBtn: 'Done, return to catalog',
      items: {
        'specialty-coffee': {
          title: 'Specialty coffee',
          shortDesc: 'Flat white, latte, or cappuccino crafted with single-origin beans.',
          fullDesc:
            'Enjoy a freshly pulled cup of our medium-roast specialty coffee with farm milk or your preferred plant-based milk, crafted to order by our baristas.',
        },
        'artisan-pastry': {
          title: 'Artisan pastry duo',
          shortDesc: 'French butter croissant and freshly braided cardamom bun.',
          fullDesc:
            'Baked every morning using 24-hour cold-fermented dough: pairs one flaky butter croissant with our house braided cardamom roll.',
        },
        'citrus-olive-cake': {
          title: 'Olive oil citrus cake slice',
          shortDesc: 'Tender extra-virgin olive oil sponge with candied orange peel.',
          fullDesc:
            'Our signature house recipe baked with extra-virgin olive oil, fresh orange zest, and slow-simmered candied citrus strips.',
        },
        'coffee-beans-bag': {
          title: 'Single-origin coffee beans 250g',
          shortDesc: 'Small-batch seasonal roast to brew at home.',
          fullDesc:
            'Take home a 250g pouch of our seasonal single-origin harvest with tasting notes of dark cocoa, toasted hazelnut, and floral honey. Whole bean or custom ground.',
        },
        'brunch-for-two': {
          title: 'Artisan brunch for two',
          shortDesc: 'Sourdough avocado toast, poached eggs, seasonal fruit, and two coffees.',
          fullDesc:
            'A sunlit table made for sharing: two sourdough avocado toasts topped with poached eggs, a seasonal fruit bowl, and two specialty espressos or lattes.',
        },
        'olive-canvas-tote': {
          title: 'La Ruedita olive canvas tote',
          shortDesc: 'Heavy organic cotton canvas in signature olive with cream straps.',
          fullDesc:
            'Limited-run everyday tote crafted from thick organic cotton canvas with reinforced warm cream handles—ideal for market runs and café mornings.',
        },
      },
    },
    history: {
      title: 'History',
      subtitle: 'Review your points earned, points used, and redeemed rewards.',
      searchPlaceholder: 'Search by description or branch...',
      filterAll: 'All',
      filterEarned: 'Points earned',
      filterUsed: 'Points used',
      filterRedeemed: 'Rewards redeemed',
      typeLabels: {
        earned: 'Earned',
        used: 'Used',
        redeemed: 'Redeemed',
      },
      emptyTitle: 'No matching entries',
      emptyDesc: 'Adjust your filter or search term to see your other activity.',
      clearSearch: 'Reset filters',
      viewVoucher: 'View code',
      voucherModalTitle: 'Redemption details',
      entries: {
        hist_morning_visit_title: 'Morning counter visit',
        hist_morning_visit_desc: 'Visit logged with code MAR4821 · Casa Central',
        hist_redeem_coffee_title: 'Redeemed: Specialty coffee',
        hist_redeem_coffee_desc: 'In-store reward enjoyed · Voucher LR-DEMO-3041',
        hist_weekend_brunch_title: 'Weekend brunch table',
        hist_weekend_brunch_desc: 'Table for two with coffee & bakery · Jardín Botánico',
        hist_bakery_box_title: 'Artisan pastry box',
        hist_bakery_box_desc: 'Box of four freshly baked pastries · Casa Central',
        hist_redeem_pastry_title: 'Redeemed: Artisan pastry duo',
        hist_redeem_pastry_desc: 'Points redeemed in store · Voucher LR-DEMO-2189',
        hist_welcome_bonus_title: 'Club anniversary bonus',
        hist_welcome_bonus_desc: 'Complimentary loyalty points from Club La Ruedita',
        hist_new_member_title: 'Welcome bonus (demo)',
        hist_new_member_desc: 'Starter points for creating your demonstration profile',
        hist_demo_redemption_desc: 'Simulated redemption from the rewards catalog',
      },
    },
    profile: {
      title: 'My profile',
      subtitle: 'Manage your member details, language, and screen previews.',
      memberIdLabel: 'Customer ID',
      memberSinceLabel: 'Member since',
      emailLabel: 'Email address',
      birthDateLabel: 'Date of birth',
      favoriteBranchLabel: 'Preferred location',
      editProfileBtn: 'Edit details',
      editModalTitle: 'Edit profile details',
      fullNameLabel: 'Full name',
      saveSuccess: 'Your preferences have been saved.',
      validationError: 'Please enter your full name and a valid email address.',
      languageSectionTitle: 'App language',
      languageSectionDesc: 'Switch the language across all screens, menus, and assistant replies.',
      preferencesTitle: 'Preferences & communications',
      whatsappTitle: 'WhatsApp updates',
      whatsappDesc: 'Receive club campaigns and promotions via WhatsApp (optional).',
      notificationsTitle: 'Reward alerts (coming soon)',
      notificationsDesc:
        'Visual preference prepared for future alerts. Does not request real permissions.',
      notificationsPreviewNotice:
        'Visual preference saved in demo mode only. No real push permission is requested.',
      settingsTitle: 'Account & app settings',
      registerNewAccount: 'Try sign-up flow',
      registerNewAccountDesc: 'Create a fictional account to preview the member registration flow.',
      switchToMaria: 'Switch back to María Rodríguez (MAR4821)',
      switchToMariaDesc: 'Restore the primary demo account with 850 points.',
      resetDemoData: 'Reset demo data',
      resetDemoDataDesc: 'Restore the initial 850-point balance and sample activity history.',
      resetDoneToast: 'Demo data has been restored.',
      signOutTitle: 'Sign out of this account',
      signOutDesc: 'Ends your session on this device. Your points stay saved with the club.',
      installPwaRowTitle: 'Install app on this device',
      installPwaRowDesc: 'Add Club La Ruedita to your home screen or desktop.',
      installPwaRowInstalled: 'You are currently running the installed app.',
      previewsSectionTitle: 'Screen previews',
      previewsSectionDesc:
        'Interactively preview how Club La Ruedita greets members across devices.',
      previewsDisclaimer:
        'Interactive visual preview only — never requests real browser or OS permissions.',
      previewTabs: {
        android: 'Android',
        iosSafari: 'iPhone Safari',
        iosChrome: 'iPhone Chrome',
        notifications: 'Notifications',
      },
      notifDemoTitle: 'Allow Club La Ruedita alerts?',
      notifDemoBody:
        'We will let you know when you unlock a new reward or when seasonal treats arrive.',
      notifDemoAllow: 'Allow (Demo)',
      notifDemoLater: 'Not now',
      notifDemoAllowedFeedback:
        'Preview confirmed: this shows how enabled alerts will appear once connected.',
      notifDemoLaterFeedback:
        'Preview dismissed: members can always revisit this preference later.',
      androidSimulatedInstalled: 'Preview complete! Android confirms the app icon was added.',
      androidResetPreview: 'Replay install screen',
    },
    memberCard: {
      title: 'Member pass',
      subtitle: 'Present this pass at checkout to earn or redeem points.',
      presentAtCounter: 'Present at counter',
      codeLabel: 'Identification code',
      balanceLabel: 'Available points',
    },
    registration: {
      title: 'Join Club La Ruedita',
      subtitle: 'Create your demo profile in seconds and explore member perks.',
      fullNameLabel: 'Full name',
      fullNamePlaceholder: 'e.g. Clara Bennett',
      emailLabel: 'Email address',
      emailPlaceholder: 'clara@example.com',
      phoneLabel: 'Phone number',
      phonePlaceholder: 'e.g. +1 555 123 4567',
      birthDateLabel: 'Date of birth',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      whatsappOptInLabel: 'I want to receive news and promotions on WhatsApp',
      whatsappOptInHint: 'Optional · You can update this anytime in Profile.',
      submitBtn: 'Create account',
      submittingBtn: 'Creating profile...',
      legalNoticePrefix: 'By continuing, you acknowledge our',
      termsLink: 'Terms of Use',
      privacyLink: 'Privacy Policy',
      cookiesLink: 'Cookie Policy',
      legalConnectorAnd: 'and',
      errorNameRequired: 'Please enter your full name.',
      errorEmailInvalid: 'Please enter a valid email address.',
      errorPhoneInvalid: 'Please enter a valid phone number.',
      errorBirthRequired: 'Please choose your date of birth.',
      errorPasswordShort: 'Password must be at least 6 characters.',
      successTitle: 'You are in!',
      successSubtitle: 'You can now explore the app with your new sample profile and member code.',
      successWelcomeBonus: 'Your welcome points have been added.',
      successContinueBtn: 'Enter my club',
      demoNotice: 'Demo registration: details stay locally in your browser only.',
      consentLabel: 'I agree that Club La Ruedita may use my data to manage my account and message me on WhatsApp.',
      errorConsentRequired: 'You need to accept this to join the club.',
      errorGeneric: 'We could not complete your registration. Please try again.',
      legalDocs: {
        terms: {
          title: 'Terms of Use',
          body: ['This document is under review. Please ask at the restaurant for the current version.'],
        },
        privacy: {
          title: 'Privacy Policy',
          body: ['This document is under review. Please ask at the restaurant for the current version.'],
        },
        cookies: {
          title: 'Cookie Policy',
          body: ['This document is under review. Please ask at the restaurant for the current version.'],
        },
      },
    },
    assistant: {
      title: 'Club La Ruedita Assistant',
      subtitle: 'Here to help with points, rewards, and sign-up',
      welcomeMessage:
        'Hi! I am the Club La Ruedita assistant. Type your member code to check your points, ask about rewards, or create your account.',
      placeholder: 'Enter a code (MAR4821, SOF4821) or ask a question...',
      sendAria: 'Send message',
      quickCheckMar: 'Check MAR4821',
      quickCheckSof: 'Check SOF4821',
      quickBenefits: 'Available rewards',
      quickRegister: 'Simulate sign-up',
      quickInstall: 'How to install app',
      replyPointsFound:
        'Hi, {name}! Your code {code} has {points} points. You need {remaining} more for your next reward ({target} points).',
      replyPointsUnlocked:
        'Found the profile for {name} ({code}).\n\n• Current balance: {points} points\n• Great news! Eligible rewards include Specialty Coffee, 250g Single-Origin Beans (1,000 pts), and Artisan Brunch for Two (1,200 pts).\n• Preferred location: {branch}',
      replyCodeNotFound:
        'I could not find code {code}. Please check it and try again.',
      replyBenefitsSummary:
        'With your {points} points you can redeem {count} rewards right now. Want to see them?',
      replyRegisterGuide:
        'Joining is quick: your name, mobile number with area code, and date of birth. Shall I open the form?',
      replyInstallGuide:
        'You can install Club La Ruedita in seconds:\n• On Android: tap the yellow "Install app" button or Chrome’s menu.\n• On iPhone: open in Safari and tap Share → Add to Home Screen → Add.\n\nYou can also explore interactive device previews inside your Profile.',
      replyFallback:
        'Happy to help! You can type a sample member code like MAR4821 or SOF4821 to check points, ask about available benefits, or try the registration flow.',
      actionViewRewards: 'Browse Rewards',
      actionOpenRegister: 'Open sign-up form',
      actionTrySof: 'Check SOF4821',
      actionOpenPreviews: 'Open install previews',
      demoFooterNote: 'Club assistant. Check your points with your member code.',
    },
  },

  pt: {
    langName: 'Português',
    locale: 'pt-BR',
    nav: {
      home: 'Início',
      points: 'Pontos',
      rewards: 'Benefícios',
      history: 'Histórico',
      profile: 'Perfil',
      assistant: 'Assistente',
      assistantAria: 'Abrir assistente virtual do Club La Ruedita',
    },
    common: {
      pointsShort: 'pts',
      pointsFull: 'pontos',
      close: 'Fechar',
      cancel: 'Cancelar',
      save: 'Salvar alterações',
      saving: 'Salvando...',
      loading: 'Atualizando...',
      refresh: 'Atualizar',
      copied: 'Código copiado',
      copyCode: 'Copiar código',
      demoNote: 'Programa de fidelidade',
      connectionError: 'Não foi possível conectar ao clube. Verifique sua conexão e tente novamente.',
      viewAll: 'Ver tudo',
      available: 'Disponível',
      locked: 'Bloqueado',
      missingPoints: 'Faltam {points} pts',
      back: 'Voltar',
      optional: 'Opcional',
    },
    pwa: {
      androidTitle: 'Leve o Club La Ruedita no seu celular',
      androidSubtitle:
        'Consulte seus pontos, apresente seu código no caixa e aproveite suas recompensas com rapidez.',
      installAppButton: 'Instalar aplicativo',
      continueBrowserButton: 'Continuar pelo navegador',
      androidManualTitle: 'Como instalar manualmente no Android',
      androidManualSteps: [
        'Toque no menu de três pontos (⋮) no canto superior do Chrome.',
        'Selecione "Instalar aplicativo" ou "Adicionar à tela inicial".',
        'Confirme tocando em "Instalar" para fixar o ícone na tela inicial.',
      ],
      deviceSwitchLabel: 'Selecione seu dispositivo',
      iosSafariTitle: 'Instale o Club La Ruedita no iPhone',
      iosSafariSubtitle:
        'Siga estes três passos no Safari para abrir seu cartão do clube como um aplicativo.',
      iosSteps: [
        'Toque no botão Compartilhar na barra inferior do Safari.',
        'Role para baixo e selecione "Adicionar à Tela de Início".',
        'Toque em "Adicionar" no canto superior direito.',
      ],
      iosOtherTitle: 'Abra o Club La Ruedita no Safari',
      iosOtherSubtitle:
        'No iPhone, a instalação na Tela de Início está disponível apenas pelo navegador Safari.',
      iosOtherGuide:
        'Abra este endereço no Safari e depois toque em Compartilhar → Adicionar à Tela de Início → Adicionar.',
      desktopBannerTitle: 'Instale o Club La Ruedita no computador',
      desktopBannerDesc:
        'Acesse seus pontos e benefícios em uma janela dedicada, inclusive sem conexão.',
      desktopInstallAction: 'Instalar app',
      installedLabel: 'Aplicativo instalado',
      offlineBanner: 'Sem conexão — Exibindo seus dados salvos em cache.',
      onlineRestored: 'Conexão restabelecida — Você está online novamente.',
      updateAvailable: 'Há uma nova versão do Club La Ruedita disponível.',
      updateAction: 'Atualizar agora',
      installSuccessToast: 'Club La Ruedita instalado com sucesso.',
      installUnavailableToast:
        'A instalação automática não está disponível neste navegador. Abra o link no Google Chrome atualizado e tente novamente.',
    },
    home: {
      greeting: 'Olá, {name}!',
      subtitle: 'Que bom ter você de volta ao Club La Ruedita.',
      currentBalance: 'Saldo atual',
      memberCodeLabel: 'Código do cliente',
      showCard: 'Mostrar cartão',
      nextRewardProgress: 'Progresso até a próxima recompensa',
      pointsToNext: 'Faltam {points} pts para alcançar {target} pts',
      rewardGoalReached: 'Você superou a meta de {target} pts! Novas recompensas liberadas.',
      quickActionsTitle: 'Acesso rápido',
      actionCard: 'Meu cartão',
      actionPoints: 'Meus pontos',
      actionRewards: 'Benefícios',
      actionRegister: 'Criar conta',
      featuredRewardsTitle: 'Benefícios em destaque',
      featuredRewardsSub: 'Troque seus pontos por experiências artesanais na loja.',
      recentActivityTitle: 'Últimas atividades',
      recentActivitySub: 'Suas movimentações mais recentes no clube.',
      noRecentActivity: 'Ainda não há movimentos. Sua atividade aparecerá aqui.',
    },
    points: {
      title: 'Seus pontos',
      subtitle: 'Acompanhe seu saldo acumulado e quanto falta para a próxima recompensa.',
      availableBalance: 'Saldo disponível',
      accumulatedTotal: 'Pontos acumulados',
      redeemedTotal: 'Pontos utilizados',
      progressTitle: 'Caminho até {target} pontos',
      progressNextGoal: 'Próxima meta',
      milestonesTitle: 'Marcos de recompensa',
      milestoneReached: 'Alcançado',
      milestoneCurrent: 'Em andamento',
      milestoneNext: 'Próximo',
      howItWorksTitle: 'Como acumular e usar pontos',
      step1Title: 'Mostre seu código',
      step1Desc: 'Informe seu código de cliente no caixa em cada visita.',
      step2Title: 'Acumule nas compras',
      step2Desc: 'Ganhe pontos automaticamente em cafés e itens de padaria.',
      step3Title: 'Resgate benefícios',
      step3Desc: 'Troque seus pontos por recompensas exclusivas na loja.',
      movementsTitle: 'Movimentações de pontos',
      filterAll: 'Todos',
      filterEarned: 'Ganhos',
      filterUsed: 'Utilizados',
      emptyMovements: 'Nenhuma movimentação encontrada nesta categoria.',
    },
    rewards: {
      title: 'Benefícios e recompensas',
      subtitle: 'Explore o catálogo de recompensas e simule um resgate demonstrativo.',
      yourBalance: 'Seu saldo',
      filterAll: 'Todos',
      filterAvailable: 'Disponíveis',
      filterLocked: 'Bloqueados',
      categories: {
        all: 'Todas',
        cafe: 'Cafeteria',
        bakery: 'Padaria',
        experiences: 'Experiências',
        boutique: 'Loja',
      },
      emptyStateTitle: 'Nenhuma recompensa com estes filtros',
      emptyStateDesc: 'Altere os filtros de disponibilidade ou categoria para ver todo o catálogo.',
      clearFilters: 'Mostrar todo o catálogo',
      detailCost: 'Pontos necessários',
      detailYourBalance: 'Seu saldo atual',
      detailAfterRedeem: 'Saldo estimado após resgate',
      detailNeeded: 'Pontos restantes',
      detailTermsTitle: 'Detalhes da recompensa',
      detailTermsBody:
        'Válido no La Ruedita mediante apresentação do código no caixa.',
      simulateRedeemBtn: 'Resgatar',
      simulatingRedeem: 'Gerando seu código...',
      insufficientPointsBtn: 'Pontos insuficientes',
      voucherTitle: 'Prêmio pronto!',
      voucherSubtitle: 'Apresente este vale de exemplo no balcão para visualizar a experiência.',
      voucherCodeLabel: 'Código do resgate',
      voucherDemoDisclaimer:
        'Mostre este código no caixa para retirar seu prêmio. Também o guardamos no seu histórico.',
      voucherDoneBtn: 'Pronto, voltar ao catálogo',
      items: {
        'specialty-coffee': {
          title: 'Café especial artesanal',
          shortDesc: 'Flat white, latte ou cappuccino preparado com grãos selecionados.',
          fullDesc:
            'Desfrute de uma xícara do nosso café especial de torra média com leite fresco ou bebida vegetal à escolha, preparado na hora pelos baristas.',
        },
        'artisan-pastry': {
          title: 'Dupla de padaria artesanal',
          shortDesc: 'Croissant de manteiga e pãozinho trançado de cardamomo.',
          fullDesc:
            'Assado todas as manhãs com fermentação lenta de 24 horas: inclui um croissant clássico folhado e um pãozinho trançado de cardamomo.',
        },
        'citrus-olive-cake': {
          title: 'Fatia de bolo cítrico de azeite',
          shortDesc: 'Massa macia de azeite extravirgem com laranja cristalizada.',
          fullDesc:
            'Nossa receita da casa feita com azeite de oliva extravirgem, raspas de laranja fresca e cobertura artesanal de cítricos cristalizados.',
        },
        'coffee-beans-bag': {
          title: 'Pacote de café em grãos 250g',
          shortDesc: 'Lote de origem única torrado em pequenas fornadas.',
          fullDesc:
            'Leve para casa 250g da nossa colheita sazonal com notas de cacau, avelã torrada e mel floral. Disponível em grãos ou moído para o seu método.',
        },
        'brunch-for-two': {
          title: 'Brunch artesanal para dois',
          shortDesc: 'Torradas de fermentação natural, ovos pochê, frutas e dois cafés.',
          fullDesc:
            'Uma mesa completa para compartilhar: duas torradas de pão artesanal com abacate e ovos pochê, tigela de frutas da estação e dois cafés especiais.',
        },
        'olive-canvas-tote': {
          title: 'Ecobag de lona La Ruedita',
          shortDesc: 'Algodão orgânico verde oliva com alças reforçadas em tom creme.',
          fullDesc:
            'Bolsa edição limitada em lona de algodão orgânico encorpado, ideal para suas idas ao mercado ou tardes de café.',
        },
      },
    },
    history: {
      title: 'Histórico',
      subtitle: 'Consulte pontos recebidos, utilizados e recompensas resgatadas.',
      searchPlaceholder: 'Buscar por descrição ou unidade...',
      filterAll: 'Todos',
      filterEarned: 'Pontos recebidos',
      filterUsed: 'Pontos utilizados',
      filterRedeemed: 'Recompensas resgatadas',
      typeLabels: {
        earned: 'Recebidos',
        used: 'Utilizados',
        redeemed: 'Resgatado',
      },
      emptyTitle: 'Nenhum registro encontrado',
      emptyDesc: 'Ajuste os filtros ou o texto da busca para ver suas outras movimentações.',
      clearSearch: 'Limpar filtros',
      viewVoucher: 'Ver código',
      voucherModalTitle: 'Detalhes do resgate',
      entries: {
        hist_morning_visit_title: 'Café da manhã no balcão',
        hist_morning_visit_desc: 'Visita registrada com código MAR4821 · Casa Central',
        hist_redeem_coffee_title: 'Resgate: Café especial artesanal',
        hist_redeem_coffee_desc: 'Recompensa utilizada na loja · Vale LR-DEMO-3041',
        hist_weekend_brunch_title: 'Brunch de fim de semana',
        hist_weekend_brunch_desc: 'Mesa para dois com café e padaria · Jardín Botánico',
        hist_bakery_box_title: 'Caixa de padaria artesanal',
        hist_bakery_box_desc: 'Seleção de quatro itens assados · Casa Central',
        hist_redeem_pastry_title: 'Resgate: Dupla de padaria',
        hist_redeem_pastry_desc: 'Pontos utilizados em recompensa · Vale LR-DEMO-2189',
        hist_welcome_bonus_title: 'Bônus de aniversário do clube',
        hist_welcome_bonus_desc: 'Pontos de cortesia por fazer parte do Club La Ruedita',
        hist_new_member_title: 'Bônus de boas-vindas (demo)',
        hist_new_member_desc: 'Pontos iniciais ao criar sua conta demonstrativa',
        hist_demo_redemption_desc: 'Resgate simulado a partir do catálogo de benefícios',
      },
    },
    profile: {
      title: 'Meu perfil',
      subtitle: 'Gerencie seus dados, idioma e pré-visualização de telas.',
      memberIdLabel: 'ID do cliente',
      memberSinceLabel: 'Membro desde',
      emailLabel: 'E-mail',
      birthDateLabel: 'Data de nascimento',
      favoriteBranchLabel: 'Unidade preferida',
      editProfileBtn: 'Editar dados',
      editModalTitle: 'Editar dados do perfil',
      fullNameLabel: 'Nome completo',
      saveSuccess: 'Suas preferências foram salvas.',
      validationError: 'Preencha seu nome completo e um e-mail válido.',
      languageSectionTitle: 'Idioma do aplicativo',
      languageSectionDesc: 'Altere o idioma de todos os menus, telas e respostas do assistente.',
      preferencesTitle: 'Preferências e comunicações',
      whatsappTitle: 'Novidades pelo WhatsApp',
      whatsappDesc: 'Receber campanhas e promoções do clube pelo WhatsApp (opcional).',
      notificationsTitle: 'Alertas de recompensas (em breve)',
      notificationsDesc:
        'Preferência visual preparada para futuros alertas. Não solicita permissões reais.',
      notificationsPreviewNotice:
        'Preferência visual salva apenas no modo demonstração. Nenhuma permissão real é solicitada.',
      settingsTitle: 'Conta e aplicativo',
      registerNewAccount: 'Testar fluxo de cadastro',
      registerNewAccountDesc: 'Crie uma conta fictícia para experimentar o cadastro de clientes.',
      switchToMaria: 'Voltar para María Rodríguez (MAR4821)',
      switchToMariaDesc: 'Restaura o perfil principal de demonstração com 850 pontos.',
      resetDemoData: 'Restaurar dados de demonstração',
      resetDemoDataDesc: 'Volta ao saldo inicial de 850 pontos e ao histórico padrão.',
      resetDoneToast: 'Dados de demonstração restaurados.',
      signOutTitle: 'Sair desta conta',
      signOutDesc: 'Encerra sua sessão neste aparelho. Seus pontos continuam guardados no clube.',
      installPwaRowTitle: 'Instalar aplicativo neste dispositivo',
      installPwaRowDesc: 'Adicione o Club La Ruedita à sua tela inicial ou computador.',
      installPwaRowInstalled: 'Você já está usando o aplicativo instalado.',
      previewsSectionTitle: 'Vista previa de pantallas',
      previewsSectionDesc:
        'Visualize de forma interativa como o Club La Ruedita aparece em cada dispositivo.',
      previewsDisclaimer:
        'Demonstração visual simulada: não solicita permissões reais do navegador.',
      previewTabs: {
        android: 'Android',
        iosSafari: 'iPhone Safari',
        iosChrome: 'iPhone Chrome',
        notifications: 'Notificações',
      },
      notifDemoTitle: 'Ativar alertas do Club La Ruedita?',
      notifDemoBody:
        'Avisaremos quando você liberar uma nova recompensa ou houver novidades sazonais.',
      notifDemoAllow: 'Permitir (Demo)',
      notifDemoLater: 'Agora não',
      notifDemoAllowedFeedback:
        'Demonstração confirmada: assim aparecerá a confirmação quando os alertas estiverem ativos.',
      notifDemoLaterFeedback:
        'Demonstração adiada: o cliente poderá ativar essa preferência quando quiser.',
      androidSimulatedInstalled: 'Simulação concluída! Assim o Android confirma a instalação do app.',
      androidResetPreview: 'Ver tela inicial novamente',
    },
    memberCard: {
      title: 'Cartão do cliente',
      subtitle: 'Apresente no caixa antes do pagamento para somar ou resgatar pontos.',
      presentAtCounter: 'Apresentar na loja',
      codeLabel: 'Código de identificação',
      balanceLabel: 'Pontos disponíveis',
    },
    registration: {
      title: 'Entre para o Club La Ruedita',
      subtitle: 'Crie sua conta demonstrativa em segundos e descubra os benefícios.',
      fullNameLabel: 'Nome completo',
      fullNamePlaceholder: 'Ex. Beatriz Almeida',
      emailLabel: 'E-mail',
      emailPlaceholder: 'beatriz@exemplo.com',
      phoneLabel: 'Telefone',
      phonePlaceholder: 'Ex. +55 11 99999-9999',
      birthDateLabel: 'Data de nascimento',
      passwordLabel: 'Senha',
      passwordPlaceholder: 'Mínimo de 6 caracteres',
      whatsappOptInLabel: 'Quero receber novidades e promoções pelo WhatsApp',
      whatsappOptInHint: 'Opcional · Você pode alterar quando quiser no seu perfil.',
      submitBtn: 'Criar conta',
      submittingBtn: 'Criando perfil...',
      legalNoticePrefix: 'Ao continuar, você declara estar ciente dos nossos',
      termsLink: 'Termos de Uso',
      privacyLink: 'Política de Privacidade',
      cookiesLink: 'Política de Cookies',
      legalConnectorAnd: 'e',
      errorNameRequired: 'Informe seu nome completo.',
      errorEmailInvalid: 'Informe um e-mail válido.',
      errorPhoneInvalid: 'Informe um telefone válido.',
      errorBirthRequired: 'Selecione sua data de nascimento.',
      errorPasswordShort: 'A senha precisa ter pelo menos 6 caracteres.',
      successTitle: 'Você já é sócio!',
      successSubtitle: 'Agora você pode navegar pelo aplicativo com seu novo perfil e código.',
      successWelcomeBonus: 'Seus pontos de boas-vindas já foram adicionados.',
      successContinueBtn: 'Entrar no clube',
      demoNotice: 'Cadastro demonstrativo: os dados ficam salvos apenas localmente neste navegador.',
      consentLabel: 'Aceito que o Club La Ruedita use meus dados para administrar minha conta e me envie mensagens pelo WhatsApp.',
      errorConsentRequired: 'Para entrar no clube é preciso aceitar esta autorização.',
      errorGeneric: 'Não foi possível concluir seu cadastro. Tente novamente.',
      legalDocs: {
        terms: {
          title: 'Termos de Uso',
          body: ['Este documento está em revisão. Consulte no restaurante a versão vigente.'],
        },
        privacy: {
          title: 'Política de Privacidade',
          body: ['Este documento está em revisão. Consulte no restaurante a versão vigente.'],
        },
        cookies: {
          title: 'Política de Cookies',
          body: ['Este documento está em revisão. Consulte no restaurante a versão vigente.'],
        },
      },
    },
    assistant: {
      title: 'Assistente Club La Ruedita',
      subtitle: 'Ajudo com seus pontos, benefícios e cadastro',
      welcomeMessage:
        'Olá! Sou o assistente do Club La Ruedita. Digite seu código de sócio para consultar seus pontos, pergunte sobre os prêmios ou crie sua conta.',
      placeholder: 'Digite um código (MAR4821, SOF4821) ou sua dúvida...',
      sendAria: 'Enviar mensagem',
      quickCheckMar: 'Consultar MAR4821',
      quickCheckSof: 'Consultar SOF4821',
      quickBenefits: 'Ver benefícios disponíveis',
      quickRegister: 'Simular cadastro',
      quickInstall: 'Como instalar o app',
      replyPointsFound:
        'Olá, {name}! Seu código {code} tem {points} pontos. Faltam {remaining} para o próximo prêmio ({target} pontos).',
      replyPointsUnlocked:
        'Encontrei a conta de {name} ({code}).\n\n• Saldo atual: {points} pontos\n• Ótima notícia! Já há recompensas liberadas como Café especial, Pacote de café em grãos (1.000 pts) e Brunch artesanal para dois (1.200 pts).\n• Unidade preferida: {branch}',
      replyCodeNotFound:
        'Não encontrei o código {code}. Confira e tente novamente.',
      replyBenefitsSummary:
        'Com seus {points} pontos você pode resgatar {count} prêmios agora. Quer ver?',
      replyRegisterGuide:
        'Entrar é rápido: nome, celular com DDD e data de nascimento. Abro o formulário?',
      replyInstallGuide:
        'Você pode instalar o Club La Ruedita em instantes:\n• No Android: toque no botão amarelo "Instalar aplicativo" ou no menu do Chrome.\n• No iPhone: abra no Safari e toque em Compartilhar → Adicionar à Tela de Início → Adicionar.\n\nVocê também pode explorar a pré-visualização das telas no seu Perfil.',
      replyFallback:
        'Será um prazer ajudar! Você pode digitar um código de teste como MAR4821 ou SOF4821 para consultar pontos, perguntar sobre benefícios disponíveis ou experimentar o cadastro.',
      actionViewRewards: 'Ir para Benefícios',
      actionOpenRegister: 'Abrir formulário de cadastro',
      actionTrySof: 'Consultar SOF4821',
      actionOpenPreviews: 'Ver pré-visualização de telas',
      demoFooterNote: 'Assistente do clube. Consulte seus pontos com seu código de sócio.',
    },
  },
};

export function formatTemplate(
  template: string,
  values: Record<string, string | number>
): string {
  return Object.entries(values).reduce(
    (acc, [key, val]) => acc.replaceAll(`{${key}}`, String(val)),
    template
  );
}

export function formatNumber(value: number, lang: Language): string {
  return new Intl.NumberFormat(TRANSLATIONS[lang].locale).format(value);
}

export function formatDate(isoDate: string, lang: Language): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return new Intl.DateTimeFormat(TRANSLATIONS[lang].locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatMonthYear(ym: string, lang: Language): string {
  const parts = ym.split('-').map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) return ym;
  const date = new Date(parts[0], parts[1] - 1, 1);
  return new Intl.DateTimeFormat(TRANSLATIONS[lang].locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}
