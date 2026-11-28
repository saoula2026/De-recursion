import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Cpu,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  StepForward,
  GitBranch,
  Zap,
  ShieldCheck,
  Search,
  BookOpen,
  Activity,
  Workflow,
  CheckCircle2
} from 'lucide-react';

// ============================================================================
// TRILINGUAL DICTIONARY (FR / AR / EN)
// ============================================================================
const TRANSLATIONS = {
  fr: {
    dir: 'ltr',
    faculty: 'Faculté des Mathématiques et de l’Informatique',
    university: 'Département de Mathématiques et Informatique',
    level: 'Master 1 Intelligence Artificielle • Semestre 7',
    moduleLabel: 'Module :',
    moduleName: 'Algorithmique Avancée et Complexité',
    exposeBadge: 'EXPOSÉ N° 14',
    mainTitle: 'La Dé-récursivation',
    subtitle: 'Éliminer la récursivité pour sauver la mémoire et prévenir le Stack Overflow',
    supervisorLabel: 'Encadré par :',
    supervisorName: 'Dr. HAMEURLAINE Messaoud',
    presentedBy: 'Présenté par :',
    roadmap1: '1. Pile d’appels & Mémoire (1/3 Théorie)',
    roadmap2: '2. Récursion Terminale vs Non-Terminale (1/3 Théorie)',
    roadmap3: '3. Dé-récursivation : Boucle & Pile Manuelle en C (2/3 Pratique)',
    daylightMode: 'Mode Amphithéâtre',
    darkMode: 'Mode Sombre',
    fullscreenBtn: 'Plein Écran',
    exitFullscreenBtn: 'Quitter Plein Écran',
    slideLabel: 'Page',

    // Slide 2
    s2Tag: '1/3 THÉORIE • PARTIE 1',
    s2Title: 'Architecture RAM (3 Zones) & Simulateur Call Stack',
    s2Desc: 'Chaque appel récursif empile un bloc d’activation dans la zone étroite de la pile système.',
    s2RamTitle: 'Organisation de la RAM (3 Zones)',
    s2HighAddr: 'Adresses Hautes (0xFFFF...)',
    s2LowAddr: 'Adresses Basses (0x0000...)',
    s2StackZone: '1. Pile d’appels (Call Stack)',
    s2StackSub: 'Espace limité par l’OS (1–8 Mo) — Croît vers le bas ↓',
    s2FreeZone: 'Zone Libre + Ligne de Protection OS (Limite Stack)',
    s2HeapZone: '2. Tas (Heap)',
    s2HeapSub: 'Mémoire dynamique vaste — Croît vers le haut ↑',
    s2StaticZone: '3. Code & Mémoire Statique',
    s2StaticSub: 'Instructions du programme + variables globales/statiques (taille fixe)',
    s2FrameTitle: 'Contenu d’un Stack Frame',
    s2Param: 'Paramètres d’appel (ex: n)',
    s2Local: 'Variables locales & calculs en attente',
    s2RetAddr: 'Adresse de retour (Instruction suivante)',
    s2FrameNote: 'Profondeur N ⇒ N blocs simultanés en pile.',
    s2SimTitle: 'Simulateur de Pile Système',
    s2PushBtn: 'Appel récursif f(n)',
    s2ResetBtn: 'Reset (0)',
    s2Capacity: 'Limite OS :',
    s2FramesUnit: 'frames',
    s2EmptyStack: 'Pile vide (0 / 5 Frames) — Cliquez sur « Appel récursif f(n) »',
    s2OverflowTitle: 'STACK OVERFLOW (Segmentation Fault) !',
    s2OverflowMsg: 'La pile a atteint sa limite de garde OS alors que le Heap et la zone libre sont encore vastes.',

    // Slide 3
    s3Tag: '1/3 THÉORIE • PARTIE 2',
    s3Title: 'Récursion Terminale vs Non-Terminale (Les 2 Transformations)',
    s3Desc: 'La présence ou non d’opérations après l’appel récursif détermine la stratégie d’élimination.',
    s3NonTailTitle: '1. Récursion Non-Terminale',
    s3NonTailBadge: 'O(n) Pile • Opération en attente',
    s3NonTailDesc: 'La multiplication (n * ...) attend le retour de l’appel : impossible d’écraser le frame.',
    s3TailTitle: '2. Récursion Terminale',
    s3TailBadge: 'O(1) Mémoire • TCO / Boucle while',
    s3TailDesc: 'L’appel récursif est la dernière action : le compilateur réutilise un unique bloc mémoire.',
    s3SimHeader: 'Simulation Synchronisée (n = 4) :',
    s3StepBtn: 'Étape suivante (Step)',
    s3ResetBtn: 'Reset',
    s3LaneNonTail: 'Récursion Non-Terminale (Accumulation de frames)',
    s3LaneTail: 'Récursion Terminale (Cadre unique réutilisé O(1))',

    // Slide 4
    s4Tag: '2/3 PRATIQUE • EXEMPLE 1 (CHAPITRE V)',
    s4Title: 'Fibonacci : Double Récursion Non-Terminale vs Dé-récursivation',
    s4Desc: 'Comparaison de l’explosion exponentielle O(2ⁿ) avec la version dé-récursivée O(1) en mémoire.',
    s4SliderLabel: 'Paramètre n :',
    s4NaiveTitle: 'Double Récursion Non-Terminale',
    s4NaiveSub: 'fib(n) = fib(n-1) + fib(n-2) génère un arbre d’appels redondants',
    s4NaiveCallsLabel: 'Appels récursifs (~2ⁿ) :',
    s4NaiveTime: 'Temps : O(2ⁿ) — Explosion exponentielle',
    s4NaiveSpace: 'Espace : O(n) frames actifs dans la Call Stack',
    s4OptTitle: 'Dé-récursivation (Boucle for : a, b)',
    s4OptSub: 'Élimination totale de la récursion par glissement de 2 variables',
    s4OptIterLabel: 'Itérations de boucle :',
    s4OptTime: 'Temps : O(n) — Linéaire',
    s4OptSpace: 'Espace : O(1) — 0 frame en pile (mémoire constante)',
    s4Takeaway: 'Lien Chapitre V : La dé-récursivation supprime l’arbre O(2ⁿ) et réduit l’espace de O(n) à O(1).',

    // Slide 5
    s5Tag: '2/3 PRATIQUE • EXEMPLE 2 (ARBRE BINAIRE)',
    s5Title: 'Parcours en Profondeur (Préfixe / DFS) d’un Arbre Binaire',
    s5Desc: 'Préservation de la Call Stack OS (1 seul frame) grâce à une pile manuelle LIFO et arrêt anticipé.',
    s5MapTitle: 'Correspondance Code',
    s5RecLabel: 'Version Récursive (Pile OS)',
    s5IterLabel: 'Dé-récursivée (Pile Manuelle)',
    s5ModeFull: 'Parcours Préfixe complet',
    s5ModeSearch: 'Recherche d’une valeur',
    s5TargetLabel: 'Cible :',
    s5Step: 'Étape (Step)',
    s5Auto: 'Auto',
    s5Pause: 'Pause',
    s5Reset: 'Reset',
    s5OsStackTitle: 'Call Stack OS (Fixe)',
    s5OsStackPinned: '1 Frame : parcours_iteratif()',
    s5StackTitle: 'Pile Manuelle (LIFO)',
    s5StackTop: 'SOMMET',
    s5StackEmpty: 'Pile manuelle vide',
    s5OutputTitle: 'Ordre de visite :',
    s5FoundAlert: 'Trouvée ! Arrêt immédiat (break) & pile manuelle libérée.',
    s5NotFoundAlert: 'Valeur absente après parcours complet.',

    // Slide 6: Engineering Synthesis & Decision Rules
    s6Tag: '2/3 PRATIQUE • SYNTHÈSE & DÉCISION',
    s6Title: 'Synthèse Comparative & Règles de Décision Ingénieur',
    s6Desc: 'Bilan des complexités spatio-temporelles et heuristiques formelles de dé-récursivation.',
    s6MatrixTitle: 'Matrice Comparative de Complexité',
    s6ColApproach: 'Approche',
    s6ColTime: 'Temps',
    s6ColSpace: 'Mémoire / Pile',
    s6ColRisk: 'Stabilité OS',
    s6Row1Name: 'Récursion Non-Terminale',
    s6Row1Time: 'O(n)',
    s6Row1Space: 'O(h) Call Stack OS',
    s6Row1Risk: 'Risque Stack Overflow',
    s6Row2Name: 'Récursion Terminale',
    s6Row2Time: 'O(n)',
    s6Row2Space: 'O(1) via TCO / Boucle',
    s6Row2Risk: 'Sécurisé (O(1))',
    s6Row3Name: 'Dé-récursivation (Boucle + Pile Manuelle)',
    s6Row3Time: 'O(n)',
    s6Row3Space: 'O(h) Contrôlé (Heap)',
    s6Row3Risk: '0% Risque OS',
    s6MatrixNote: 'h = hauteur de l’arbre ou profondeur d’appels (h ≤ n). La dé-récursivation déplace la charge de la fragile pile système OS vers la mémoire contrôlée (Tas).',
    s6RulesTitle: 'Règles de Décision d’Ingénierie',
    s6Rule1Badge: 'RÈGLE 1 • TERMINALE',
    s6Rule1Title: 'Récursion Terminale → Boucle simple O(1)',
    s6Rule1Desc: 'Aucune opération en attente après l’appel : transformation directe en boucle while/for avec accumulateur. Mémoire O(1) sans aucune pile.',
    s6Rule2Badge: 'RÈGLE 2 • NON-TERMINALE',
    s6Rule2Title: 'Récursion Non-Terminale → while + Pile Manuelle LIFO',
    s6Rule2Desc: 'Opérations en attente ou embranchements : simuler le Call Stack avec une pile LIFO explicite dans le Tas. Empiler dans l’ordre inverse des appels (ex: droit puis gauche).',
    s6Rule3Badge: 'RÈGLE 3 • COÛT & CONTRÔLE',
    s6Rule3Title: 'Primitives O(1) → Temps Asymptotique Préservé',
    s6Rule3Desc: 'push() et pop() s’exécutent en temps constant O(1) sans surcoût global (O(n) conservé), avec libération immédiate et arrêt anticipé (break) sans dérouler la pile.'
  },

  ar: {
    dir: 'rtl',
    faculty: 'كلية الرياضيات والإعلام الآلي',
    university: 'قسم الرياضيات والإعلام الآلي',
    level: 'ماستر 1 ذكاء اصطناعي • السداسي السابع',
    moduleLabel: 'المقياس :',
    moduleName: 'الخوارزميات المتقدمة والتعقيد (Algorithmique Avancée et Complexité)',
    exposeBadge: 'العرض رقم 14',
    mainTitle: 'إزالة الاستدعاء الذاتي (La Dé-récursivation)',
    subtitle: 'تحويل الخوارزميات التراجعية إلى تكرارية لتوفير الذاكرة وتفادي طفح المكدس',
    supervisorLabel: 'تحت إشراف :',
    supervisorName: 'Dr. HAMEURLAINE Messaoud',
    presentedBy: 'من إعداد الطلبة :',
    roadmap1: '1. مكدس الاستدعاءات والذاكرة (1/3 نظري)',
    roadmap2: '2. التكرارية الذيلية مقابل غير الذيلية (1/3 نظري)',
    roadmap3: '3. إزالة التكرارية : حلقة ومكدس يدوي بلغة C (2/3 تطبيقي)',
    daylightMode: 'وضع المدرج المضيء',
    darkMode: 'الوضع الليلي',
    fullscreenBtn: 'ملء الشاشة',
    exitFullscreenBtn: 'إنهاء ملء الشاشة',
    slideLabel: 'صفحة',

    // Slide 2
    s2Tag: '1/3 الجانب النظري • الجزء 1',
    s2Title: 'معمارية الذاكرة RAM (3 مناطق) ومحاكي Call Stack',
    s2Desc: 'كل استدعاء ذاتي يحجز إطاراً جديداً داخل المساحة الضيقة لمكدس النظام.',
    s2RamTitle: 'تقسيم ذاكرة البرنامج (3 مناطق رئيسية)',
    s2HighAddr: 'عناوين عليا (0xFFFF...)',
    s2LowAddr: 'عناوين دنيا (0x0000...)',
    s2StackZone: '1. مكدس الاستدعاءات (Call Stack)',
    s2StackSub: 'حجم محدود من النظام (1–8 ميغابايت) — ينمو للأسفل ↓',
    s2FreeZone: 'منطقة حرة + خط حماية النظام (Limite Stack)',
    s2HeapZone: '2. الكومة (Heap)',
    s2HeapSub: 'ذاكرة ديناميكية واسعة — تنمو للأعلى ↑',
    s2StaticZone: '3. الكود والذاكرة الساكنة (Code & Statique)',
    s2StaticSub: 'تعليمات البرنامج + المتغيرات العامة والثوابت (حجم ثابت)',
    s2FrameTitle: 'مكونات إطار المكدس (Stack Frame)',
    s2Param: 'معاملات الاستدعاء (مثل n)',
    s2Local: 'المتغيرات المحلية والعمليات المعلقة',
    s2RetAddr: 'عنوان العودة (التعليمة الموالية)',
    s2FrameNote: 'عمق استدعاء N ⇐ حجز N إطاراً في آنٍ واحد.',
    s2SimTitle: 'محاكي مكدس النظام التفاعلي',
    s2PushBtn: 'Appel récursif f(n)',
    s2ResetBtn: 'Reset (0)',
    s2Capacity: 'حد النظام :',
    s2FramesUnit: 'frames',
    s2EmptyStack: 'المكدس فارغ (0 / 5 Frames) — اضغط على « Appel récursif f(n) »',
    s2OverflowTitle: 'STACK OVERFLOW (Segmentation Fault) !',
    s2OverflowMsg: 'تجاوز المكدس حد الحماية رغم أن الكومة (Heap) والمنطقة الحرة لا تزالان واسعتين.',

    // Slide 3
    s3Tag: '1/3 الجانب النظري • الجزء 2',
    s3Title: 'التكرارية الذيلية مقابل غير الذيلية (مسارا التحويل)',
    s3Desc: 'وجود عمليات معلقة بعد الاستدعاء الذاتي هو الذي يحدد طريقة التحويل المناسبة.',
    s3NonTailTitle: '1. التكرارية غير الذيلية (Récursion Non-Terminale)',
    s3NonTailBadge: 'ذاكرة O(n) • عملية معلقة',
    s3NonTailDesc: 'عملية الضرب (n * ...) تنتظر عودة الاستدعاء : لا يمكن مسح الإطار الحالي.',
    s3TailTitle: '2. التكرارية الذيلية (Récursion Terminale)',
    s3TailBadge: 'ذاكرة O(1) • حلقة while / TCO',
    s3TailDesc: 'الاستدعاء الذاتي هو آخر تعليمة : يعيد المترجم استخدام نفس الإطار الوحيد.',
    s3SimHeader: 'محاكاة متزامنة (n = 4) :',
    s3StepBtn: 'الخطوة التالية (Step)',
    s3ResetBtn: 'إعادة ضبط',
    s3LaneNonTail: 'التكرارية غير الذيلية (تراكم الإطارات)',
    s3LaneTail: 'التكرارية الذيلية (إطار وحيد مُعاد استخدامه O(1))',

    // Slide 4
    s4Tag: '2/3 الجانب التطبيقي • مثال 1 (الفصل الخامس)',
    s4Title: 'فيبوناتشي : تكرارية مزدوجة غير ذيلية مقابل إزالة التكرارية',
    s4Desc: 'مقارنة الانفجار الأسي O(2ⁿ) مع النسخة التكرارية ذات الذاكرة الثابتة O(1).',
    s4SliderLabel: 'قيمة n :',
    s4NaiveTitle: 'تكرارية مزدوجة غير ذيلية',
    s4NaiveSub: 'fib(n) = fib(n-1) + fib(n-2) تولد شجرة استدعاءات متكررة',
    s4NaiveCallsLabel: 'الاستدعاءات المتولدة (~2ⁿ) :',
    s4NaiveTime: 'الزمن : O(2ⁿ) — انفجار أسي',
    s4NaiveSpace: 'المكان : O(n) إطار نشط في Call Stack',
    s4OptTitle: 'إزالة التكرارية (حلقة for : a, b)',
    s4OptSub: 'إلغاء الاستدعاء الذاتي كلياً بتحديث متغيرين فقط',
    s4OptIterLabel: 'دورات الحلقة :',
    s4OptTime: 'الزمن : O(n) — خطي',
    s4OptSpace: 'المكان : O(1) — 0 إطار في المكدس (ذاكرة ثابتة)',
    s4Takeaway: 'الربط بالفصل الخامس : إزالة التكرارية تلغي شجرة O(2ⁿ) وتخفض الذاكرة من O(n) إلى O(1).',

    // Slide 5
    s5Tag: '2/3 الجانب التطبيقي • مثال 2 (الشجرة الثنائية)',
    s5Title: 'الاجتياز القبلي بالعمق (Préfixe / DFS) لشجرة ثنائية',
    s5Desc: 'حماية مكدس النظام Call Stack (إطار واحد ثابت) عبر مكدس يدوي LIFO مع التوقف المبكر.',
    s5MapTitle: 'مطابقة الكود',
    s5RecLabel: 'النسخة التراجعية (مكدس النظام)',
    s5IterLabel: 'المُزالة التكرارية (مكدس يدوي)',
    s5ModeFull: 'اجتياز قبلي كامل',
    s5ModeSearch: 'بحث عن قيمة',
    s5TargetLabel: 'القيمة :',
    s5Step: 'خطوة (Step)',
    s5Auto: 'تلقائي',
    s5Pause: 'إيقاف',
    s5Reset: 'Reset',
    s5OsStackTitle: 'مكدس النظام OS (ثابت)',
    s5OsStackPinned: '1 Frame : parcours_iteratif()',
    s5StackTitle: 'المكدس اليدوي (LIFO)',
    s5StackTop: 'القمة',
    s5StackEmpty: 'المكدس اليدوي فارغ',
    s5OutputTitle: 'ترتيب الزيارة :',
    s5FoundAlert: 'تم العثور عليها ! توقف فوري (break) وتفريغ المكدس اليدوي.',
    s5NotFoundAlert: 'القيمة غير موجودة بعد اكتمال الاجتياز.',

    // Slide 6: Engineering Synthesis & Decision Rules
    s6Tag: '2/3 الجانب التطبيقي • الخلاصة والقرار الهندسي',
    s6Title: 'الخلاصة المقارنة وقواعد القرار الهندسي',
    s6Desc: 'مقارنة التعقيد الزمني والمكاني والقواعد المنهجية لإزالة التكرارية.',
    s6MatrixTitle: 'مصفوفة مقارنة التعقيد',
    s6ColApproach: 'الطريقة',
    s6ColTime: 'الزمن',
    s6ColSpace: 'الذاكرة / المكدس',
    s6ColRisk: 'أمان النظام OS',
    s6Row1Name: 'تكرارية غير ذيلية (Non-Terminale)',
    s6Row1Time: 'O(n)',
    s6Row1Space: 'O(h) مكدس النظام OS',
    s6Row1Risk: 'خطر Stack Overflow',
    s6Row2Name: 'تكرارية ذيلية (Terminale)',
    s6Row2Time: 'O(n)',
    s6Row2Space: 'O(1) عبر TCO / حلقة',
    s6Row2Risk: 'آمن (ذاكرة ثابتة)',
    s6Row3Name: 'إزالة التكرارية (حلقة + مكدس يدوي)',
    s6Row3Time: 'O(n)',
    s6Row3Space: 'O(h) مراقب (الكومة)',
    s6Row3Risk: '0% خطر انهيار OS',
    s6MatrixNote: 'h = عمق الشجرة أو عمق الاستدعاء (h ≤ n). إزالة التكرارية تنقل العبء من مكدس النظام الضيق إلى الذاكرة الديناميكية المتحكم بها (الكومة).',
    s6RulesTitle: 'قواعد القرار الهندسي الثلاث',
    s6Rule1Badge: 'القاعدة 1 • ذيلية',
    s6Rule1Title: 'تكرارية ذيلية ← حلقة بسيطة O(1)',
    s6Rule1Desc: 'لا توجد أي عملية معلقة بعد الاستدعاء : تحويل مباشر إلى حلقة while/for مع مجمّع. ذاكرة O(1) بدون أي مكدس.',
    s6Rule2Badge: 'القاعدة 2 • غير ذيلية',
    s6Rule2Title: 'تكرارية غير ذيلية ← while + مكدس يدوي LIFO',
    s6Rule2Desc: 'وجود عمليات معلقة أو تفرعات : محاكاة Call Stack بمكدس LIFO صريح في الكومة. الدفع بالترتيب العكسي للاستدعاءات (الأيمن ثم الأيسر).',
    s6Rule3Badge: 'القاعدة 3 • الكفاءة والأمان',
    s6Rule3Title: 'عمليات O(1) ← الحفاظ على التعقيد الزمني',
    s6Rule3Desc: 'عمليات push و pop تنفذ في زمن ثابت O(1) مما يحافظ على التعقيد الأصلي O(n)، مع إمكانية التوقف الفوري (break) دون تفريغ قسري للمكدس.'
  },

  en: {
    dir: 'ltr',
    faculty: 'Faculty of Mathematics and Computer Science',
    university: 'Department of Mathematics and Computer Science',
    level: 'Master 1 in Artificial Intelligence • Semester 7',
    moduleLabel: 'Course:',
    moduleName: 'Advanced Algorithms and Complexity',
    exposeBadge: 'EXPOSÉ N° 14',
    mainTitle: 'De-recursion (La Dé-récursivation)',
    subtitle: 'Eliminating recursion to save memory and prevent Stack Overflow',
    supervisorLabel: 'Supervised by:',
    supervisorName: 'Dr. HAMEURLAINE Messaoud',
    presentedBy: 'Presented by:',
    roadmap1: '1. Call Stack & Memory (1/3 Theory)',
    roadmap2: '2. Tail vs Non-Tail Recursion (1/3 Theory)',
    roadmap3: '3. De-recursion: Loop & Manual Stack in C (2/3 Practice)',
    daylightMode: 'Lecture Hall Mode',
    darkMode: 'Dark Mode',
    fullscreenBtn: 'Fullscreen',
    exitFullscreenBtn: 'Exit Fullscreen',
    slideLabel: 'Page',

    // Slide 2
    s2Tag: '1/3 THEORY • PART 1',
    s2Title: 'RAM Architecture (3 Zones) & Call Stack Simulator',
    s2Desc: 'Each recursive call pushes an activation frame onto the narrow system stack segment.',
    s2RamTitle: 'Process RAM Layout (3 Main Zones)',
    s2HighAddr: 'High Addresses (0xFFFF...)',
    s2LowAddr: 'Low Addresses (0x0000...)',
    s2StackZone: '1. Call Stack',
    s2StackSub: 'Strictly bounded by OS (1–8 MB) — Grows downward ↓',
    s2FreeZone: 'Free Zone + OS Guard Line (Stack Limit)',
    s2HeapZone: '2. Heap Segment',
    s2HeapSub: 'Large dynamic memory pool — Grows upward ↑',
    s2StaticZone: '3. Code & Static Memory',
    s2StaticSub: 'Compiled program instructions + global/static variables (fixed size)',
    s2FrameTitle: 'Anatomy of a Stack Frame',
    s2Param: 'Call parameters (e.g., n)',
    s2Local: 'Local variables & pending operations',
    s2RetAddr: 'Return address (Next instruction pointer)',
    s2FrameNote: 'Recursion depth N ⇒ N concurrent frames on stack.',
    s2SimTitle: 'System Call Stack Simulator',
    s2PushBtn: 'Recursive call f(n)',
    s2ResetBtn: 'Reset (0)',
    s2Capacity: 'OS Limit:',
    s2FramesUnit: 'frames',
    s2EmptyStack: 'Empty stack (0 / 5 Frames) — Click "Recursive call f(n)"',
    s2OverflowTitle: 'STACK OVERFLOW (Segmentation Fault)!',
    s2OverflowMsg: 'Stack hit its OS guard limit even though the Heap and free space remain large.',

    // Slide 3
    s3Tag: '1/3 THEORY • PART 2',
    s3Title: 'Tail vs Non-Tail Recursion (The 2 Transformations)',
    s3Desc: 'Whether operations remain pending after the recursive call dictates the transformation strategy.',
    s3NonTailTitle: '1. Non-Tail Recursion',
    s3NonTailBadge: 'O(n) Stack • Pending Operation',
    s3NonTailDesc: 'Multiplication (n * ...) waits for the child return: current frame cannot be overwritten.',
    s3TailTitle: '2. Tail Recursion',
    s3TailBadge: 'O(1) Memory • TCO / while Loop',
    s3TailDesc: 'The recursive call is the very last instruction: compiler reuses a single stack frame.',
    s3SimHeader: 'Synchronized Simulation (n = 4):',
    s3StepBtn: 'Next Step',
    s3ResetBtn: 'Reset',
    s3LaneNonTail: 'Non-Tail Recursion (Frame Accumulation)',
    s3LaneTail: 'Tail Recursion (Single Reused Frame O(1))',

    // Slide 4
    s4Tag: '2/3 PRACTICE • EXAMPLE 1 (CHAPTER V)',
    s4Title: 'Fibonacci: Double Non-Tail Recursion vs De-recursion',
    s4Desc: 'Contrasting O(2ⁿ) exponential blowup with the O(1) space de-recursed loop.',
    s4SliderLabel: 'Parameter n:',
    s4NaiveTitle: 'Double Non-Tail Recursion',
    s4NaiveSub: 'fib(n) = fib(n-1) + fib(n-2) spawns a redundant call tree',
    s4NaiveCallsLabel: 'Recursive calls (~2ⁿ):',
    s4NaiveTime: 'Time: O(2ⁿ) — Exponential blowup',
    s4NaiveSpace: 'Space: O(n) active frames on OS Call Stack',
    s4OptTitle: 'De-recursed Version (for Loop: a, b)',
    s4OptSub: 'Complete elimination of recursion via 2 rolling variables',
    s4OptIterLabel: 'Loop iterations:',
    s4OptTime: 'Time: O(n) — Linear',
    s4OptSpace: 'Space: O(1) — 0 stack frames (constant memory)',
    s4Takeaway: 'Chapter V Link: De-recursion removes the O(2ⁿ) call tree and shrinks memory from O(n) to O(1).',

    // Slide 5
    s5Tag: '2/3 PRACTICE • EXAMPLE 2 (BINARY TREE)',
    s5Title: 'Depth-First Pre-order Traversal (DFS) of a Binary Tree',
    s5Desc: 'Preserving the OS Call Stack (pinned at 1 frame) via a manual LIFO stack with early exit.',
    s5MapTitle: 'Code Mapping',
    s5RecLabel: 'Recursive (OS Stack)',
    s5IterLabel: 'De-recursed (Manual Stack)',
    s5ModeFull: 'Full Pre-order Traversal',
    s5ModeSearch: 'Search Value',
    s5TargetLabel: 'Target:',
    s5Step: 'Step',
    s5Auto: 'Auto',
    s5Pause: 'Pause',
    s5Reset: 'Reset',
    s5OsStackTitle: 'OS Call Stack (Pinned)',
    s5OsStackPinned: '1 Frame: parcours_iteratif()',
    s5StackTitle: 'Manual Stack (LIFO)',
    s5StackTop: 'TOP',
    s5StackEmpty: 'Manual stack empty',
    s5OutputTitle: 'Visit sequence:',
    s5FoundAlert: 'Found! Immediate break & manual stack cleared.',
    s5NotFoundAlert: 'Value not found after full traversal.',

    // Slide 6: Engineering Synthesis & Decision Rules
    s6Tag: '2/3 PRACTICE • SYNTHESIS & DECISION',
    s6Title: 'Comparative Synthesis & Engineering Decision Rules',
    s6Desc: 'Complexity matrix analysis and rigorous engineering rules for de-recursion.',
    s6MatrixTitle: 'Complexity Comparison Matrix',
    s6ColApproach: 'Approach',
    s6ColTime: 'Time',
    s6ColSpace: 'Memory / Stack',
    s6ColRisk: 'OS Stability',
    s6Row1Name: 'Non-Tail Recursion',
    s6Row1Time: 'O(n)',
    s6Row1Space: 'O(h) OS Call Stack',
    s6Row1Risk: 'Stack Overflow Risk',
    s6Row2Name: 'Tail Recursion',
    s6Row2Time: 'O(n)',
    s6Row2Space: 'O(1) via TCO / Loop',
    s6Row2Risk: 'Safe (O(1) Memory)',
    s6Row3Name: 'De-recursion (Loop + Manual Stack)',
    s6Row3Time: 'O(n)',
    s6Row3Space: 'O(h) Controlled (Heap)',
    s6Row3Risk: '0% OS Crash Risk',
    s6MatrixNote: 'h = recursion depth or tree height (h ≤ n). De-recursion shifts memory burden away from the narrow OS call stack into controlled heap storage.',
    s6RulesTitle: 'Engineering Decision Rules',
    s6Rule1Badge: 'RULE 1 • TAIL',
    s6Rule1Title: 'Tail Recursion → Simple Loop O(1)',
    s6Rule1Desc: 'No pending operations after recursive call: direct transformation into a while/for loop with an accumulator. O(1) space with zero stack frames.',
    s6Rule2Badge: 'RULE 2 • NON-TAIL',
    s6Rule2Title: 'Non-Tail Recursion → while + Manual LIFO Stack',
    s6Rule2Desc: 'Pending calculations or multiple branching (trees): replace OS Call Stack with an explicit LIFO stack in Heap. Push child states in reverse invocation order.',
    s6Rule3Badge: 'RULE 3 • OVERHEAD & CONTROL',
    s6Rule3Title: 'O(1) Primitives → Asymptotic Time Preserved',
    s6Rule3Desc: 'push() and pop() run in constant O(1) time preserving overall O(n) runtime, while enabling early exit (break) without unwinding the stack.'
  }
};

// ============================================================================
// BINARY TREE DATA & STEP GENERATOR (SLIDE 5)
// ============================================================================
const TREE_NODES = {
  50: { val: 50, x: 220, y: 42, left: 30, right: 70 },
  30: { val: 30, x: 115, y: 128, left: 20, right: 40 },
  70: { val: 70, x: 325, y: 128, left: 60, right: 80 },
  20: { val: 20, x: 65, y: 215, left: null, right: null },
  40: { val: 40, x: 165, y: 215, left: null, right: null },
  60: { val: 60, x: 275, y: 215, left: null, right: null },
  80: { val: 80, x: 375, y: 215, left: null, right: null }
};

function generateTreeSteps(mode, targetVal) {
  const steps = [
    { stack: [50], visited: [], current: null, found: false, done: false }
  ];
  const stack = [50];
  const visited = [];

  while (stack.length > 0) {
    const curr = stack.pop();
    visited.push(curr);

    if (mode === 'search' && curr === targetVal) {
      steps.push({
        stack: [...stack],
        visited: [...visited],
        current: curr,
        found: true,
        done: true
      });
      return steps;
    }

    const node = TREE_NODES[curr];
    if (node.right !== null) stack.push(node.right);
    if (node.left !== null) stack.push(node.left);

    steps.push({
      stack: [...stack],
      visited: [...visited],
      current: curr,
      found: false,
      done: stack.length === 0
    });
  }
  return steps;
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0); // 0..5
  const [theme, setTheme] = useState('light'); // 'light' (Daylight default) | 'dark'
  const [lang, setLang] = useState('fr'); // 'fr' | 'ar' | 'en'
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Slide 2: Call Stack Simulator (Strictly starts at 0 frames, max 5 before overflow)
  const MAX_OS_FRAMES = 5;
  const [frameCount, setFrameCount] = useState(0); // 0..6 (6 = overflow)
  const isOverflow = frameCount > MAX_OS_FRAMES;

  // Slide 3: Tail vs Non-Tail Synchronized Step Simulator (n = 4)
  const [step3, setStep3] = useState(1); // 1..5

  // Slide 4: Fibonacci Slider (n = 5..30)
  const [fibN, setFibN] = useState(18);

  // Slide 5: Binary Tree DFS & Custom Search Simulator
  const [treeMode, setTreeMode] = useState('full'); // 'full' | 'search'
  const [targetVal, setTargetVal] = useState(40);
  const [treeStepIdx, setTreeStepIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const stageWrapperRef = useRef(null);
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  // Responsive Fullscreen Change Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Responsive 16:9 Scaling Engine (Clean edge-to-edge calculation)
  useEffect(() => {
    const updateScale = () => {
      if (!stageWrapperRef.current) return;
      const rect = stageWrapperRef.current.getBoundingClientRect();
      const availW = Math.max(320, rect.width - 16);
      const availH = Math.max(240, rect.height - 16);
      setScale(Math.min(availW / 1280, availH / 720));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    let ro;
    if (typeof ResizeObserver !== 'undefined' && stageWrapperRef.current) {
      ro = new ResizeObserver(updateScale);
      ro.observe(stageWrapperRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateScale);
      ro?.disconnect();
    };
  }, []);

  // Keyboard Arrow Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (lang === 'ar' ? Math.max(0, prev - 1) : Math.min(5, prev + 1)));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (lang === 'ar' ? Math.min(5, prev + 1) : Math.max(0, prev - 1)));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lang]);

  // Precompute Slide 5 Steps
  const treeSteps = useMemo(
    () => generateTreeSteps(treeMode, Number(targetVal) || 0),
    [treeMode, targetVal]
  );

  // Slide 5 Auto-Play Timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setTreeStepIdx((prev) => {
        if (prev >= treeSteps.length - 1) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1100);
    return () => clearInterval(timer);
  }, [isAutoPlaying, treeSteps.length]);

  // Precompute Slide 4 Fibonacci Metrics
  const fibMetrics = useMemo(() => {
    const fibVals = [0, 1];
    for (let i = 2; i <= 36; i++) {
      fibVals[i] = fibVals[i - 1] + fibVals[i - 2];
    }
    const fn = fibVals[fibN];
    const naiveCalls = 2 * fibVals[fibN + 1] - 1;
    return { fn, naiveCalls };
  }, [fibN]);

  // High-Contrast Theme Design Tokens
  const tokens = isDark
    ? {
        appBg: 'bg-[#070B14]',
        toolbarBg: 'bg-[#0F172A]/95 border-slate-800 text-slate-100',
        slideBg: 'bg-[#0B1120] text-slate-100 border-slate-800',
        cardBg: 'bg-[#111827] border-slate-800',
        cardSubtle: 'bg-[#1E293B]/70 border-slate-700',
        textMain: 'text-slate-100',
        textMuted: 'text-slate-300',
        textSoft: 'text-slate-400',
        accentBlue: 'text-sky-400',
        badgeBlue: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        badgeEmerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        badgeCrimson: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        badgeAmber: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      }
    : {
        appBg: 'bg-slate-200',
        toolbarBg: 'bg-white border-slate-300 text-slate-900 shadow-sm',
        slideBg: 'bg-white text-slate-900 border-slate-300',
        cardBg: 'bg-slate-50 border-slate-200',
        cardSubtle: 'bg-white border-slate-200 shadow-sm',
        textMain: 'text-slate-900',
        textMuted: 'text-slate-700',
        textSoft: 'text-slate-500',
        accentBlue: 'text-blue-700',
        badgeBlue: 'bg-blue-50 text-blue-800 border-blue-200',
        badgeEmerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badgeCrimson: 'bg-red-50 text-red-800 border-red-200',
        badgeAmber: 'bg-amber-50 text-amber-900 border-amber-200'
      };

  // Shared Slide Header
  const renderSlideHeader = (tag, title, desc, slideNum) => (
    <div className="flex items-start justify-between border-b pb-3 mb-4 border-current/10">
      <div className="space-y-1 max-w-[84%]">
        <div className="flex items-center gap-2.5">
          <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold tracking-wider uppercase border ${tokens.badgeBlue}`}>
            {tag}
          </span>
          <span className={`text-xs font-bold ${tokens.textSoft}`}>{t.moduleName}</span>
        </div>
        <h2 className={`text-[26px] font-black tracking-tight leading-tight ${tokens.textMain}`}>
          {title}
        </h2>
        <p className={`text-[15px] font-semibold ${tokens.textMuted}`}>{desc}</p>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <span className={`text-xs font-extrabold uppercase tracking-widest ${tokens.textSoft}`}>
          {t.exposeBadge}
        </span>
        <span className={`mt-1 px-3 py-1 rounded-lg text-sm font-mono font-extrabold border ${tokens.cardBg}`}>
          {slideNum} / 6
        </span>
      </div>
    </div>
  );

  // ==========================================================================
  // SLIDE 1: PAGE DE GARDE (ACADEMIC CREDITS & FACULTY NAME)
  // ==========================================================================
  const renderSlide1 = () => (
    <div className={`w-[1280px] h-[720px] p-10 flex flex-col justify-between relative overflow-hidden ${tokens.slideBg}`}>
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600" />

      {/* Top Academic Header */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src="/univlogo.jpg"
            alt="Université Ahmed Ben Yahia El-Wancharissi — Tissemsilt"
            className="w-28 h-28 object-contain rounded-2xl p-2 border-2 border-slate-200 dark:border-slate-700 bg-white shadow-md shrink-0"
            onError={(e) => {
              if (e.currentTarget.src !== 'https://pmb.univ-tissemsilt.dz/styles/zen/images/zen_pers/univlogo.jpg') {
                e.currentTarget.src = 'https://pmb.univ-tissemsilt.dz/styles/zen/images/zen_pers/univlogo.jpg';
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
          <div className="flex flex-col justify-center space-y-1">
            <div className={`text-[11px] font-bold uppercase tracking-wider ${tokens.textSoft}`}>
              {lang === 'ar'
                ? 'الجمهورية الجزائرية الديمقراطية الشعبية'
                : 'République Algérienne Démocratique et Populaire'}
            </div>
            <div className={`text-xl font-black tracking-tight leading-snug ${tokens.textMain}`}>
              {lang === 'ar'
                ? 'جامعة أحمد بن يحيى الونشريسي — تيسمسيلت'
                : 'Université Ahmed Ben Yahia El-Wancharissi — Tissemsilt'}
            </div>
            <div className={`text-xs font-extrabold ${tokens.accentBlue}`}>
              {t.faculty}
            </div>
            <div className="pt-0.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border ${tokens.badgeBlue}`}>
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.level}</span>
              </span>
            </div>
          </div>
        </div>

        <div className={`px-4 py-2.5 rounded-xl border text-end shrink-0 self-center ${tokens.cardBg}`}>
          <div className={`text-[11px] font-bold uppercase tracking-wider ${tokens.textSoft}`}>
            {t.moduleLabel}
          </div>
          <div className={`text-sm font-extrabold ${tokens.accentBlue}`}>
            {t.moduleName}
          </div>
        </div>
      </div>

      {/* Main Title Card */}
      <div className={`my-auto py-7 px-9 rounded-3xl border-2 ${isDark ? 'bg-slate-900/90 border-blue-500/30' : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/70 border-blue-200 shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="px-4 py-1.5 rounded-xl bg-blue-700 text-white font-mono font-black text-base tracking-wide">
            {t.exposeBadge}
          </span>
          <span className={`px-3.5 py-1.5 rounded-xl text-sm font-extrabold border ${tokens.badgeEmerald}`}>
            Call Stack • TCO • LIFO • Complexité
          </span>
        </div>

        <h1 className={`text-[46px] font-black tracking-tight leading-tight mb-2.5 ${tokens.textMain}`}>
          {t.mainTitle}
        </h1>
        <p className={`text-xl font-bold leading-snug max-w-4xl ${tokens.textMuted}`}>
          {t.subtitle}
        </p>

        {/* 3-Step Roadmap Pills */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-current/10">
          <div className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold ${tokens.badgeBlue}`}>
            {t.roadmap1}
          </div>
          <div className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold ${tokens.badgeEmerald}`}>
            {t.roadmap2}
          </div>
          <div className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold ${tokens.badgeAmber}`}>
            {t.roadmap3}
          </div>
        </div>
      </div>

      {/* Bottom Credits: Supervisor + 3 Students (Strictly required names) */}
      <div className="grid grid-cols-12 gap-5 items-stretch">
        <div className={`col-span-4 p-5 rounded-2xl border flex flex-col justify-center ${isDark ? 'bg-indigo-950/40 border-indigo-500/30' : 'bg-blue-50/80 border-blue-200'}`}>
          <span className={`text-xs font-extrabold uppercase tracking-wider mb-1 ${tokens.accentBlue}`}>
            {t.supervisorLabel}
          </span>
          <div className={`text-xl font-black ${tokens.textMain}`}>{t.supervisorName}</div>
          <div className={`text-xs font-bold mt-1.5 ${tokens.textSoft}`}>Master 1 I.A — Semestre 7</div>
        </div>

        <div className={`col-span-8 p-5 rounded-2xl border ${tokens.cardBg}`}>
          <div className={`text-xs font-extrabold uppercase tracking-wider mb-3 ${tokens.textSoft}`}>
            {t.presentedBy}
          </div>
          <div className="grid grid-cols-3 gap-3.5" dir="ltr">
            {['Saoula Youcef Abderrazak', 'Izzedine Hallali', 'Boughana Samir'].map((studentName, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border flex items-center gap-3 ${tokens.cardSubtle}`}>
                <span className="w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className={`text-[15px] font-black leading-snug ${tokens.textMain}`}>
                  {studentName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================================================
  // SLIDE 2: [1/3 THÉORIE — PART 1] CALL STACK & STACK OVERFLOW (STARTS AT 0)
  // ==========================================================================
  const renderSlide2 = () => (
    <div className={`w-[1280px] h-[720px] p-9 flex flex-col justify-between ${tokens.slideBg}`}>
      {renderSlideHeader(t.s2Tag, t.s2Title, t.s2Desc, 2)}

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Column 1: RAM Process Architecture (Strictly 3 Main Zones + Guard Line) */}
        <div className={`col-span-4 p-5 rounded-2xl border flex flex-col justify-between ${tokens.cardBg}`}>
          <h3 className={`text-base font-black flex items-center gap-2 ${tokens.textMain}`}>
            <Cpu className="w-5 h-5 text-blue-700" />
            <span>{t.s2RamTitle}</span>
          </h3>

          <div className="text-xs font-mono font-bold text-right opacity-70">{t.s2HighAddr}</div>

          <div className="flex-1 flex flex-col justify-between my-2 border-2 rounded-xl overflow-hidden border-slate-400/50">
            {/* Zone 1: Call Stack */}
            <div className={`p-3.5 ${isDark ? 'bg-rose-950/35' : 'bg-rose-50'}`}>
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-rose-700 dark:text-rose-300">{t.s2StackZone}</span>
                <span className="px-2 py-0.5 text-xs font-mono font-extrabold rounded bg-rose-600 text-white">LIFO ↓</span>
              </div>
              <p className={`text-xs mt-1 font-semibold ${tokens.textMuted}`}>{t.s2StackSub}</p>
            </div>

            {/* OS Guard Line & Free Margin */}
            <div className={`py-2 px-3 border-y-2 border-dashed border-red-600 text-center flex flex-col items-center justify-center ${isDark ? 'bg-slate-900/60' : 'bg-slate-100'}`}>
              <span className="text-[11px] font-extrabold text-red-700 dark:text-red-400">{t.s2FreeZone}</span>
            </div>

            {/* Zone 2: Heap */}
            <div className={`p-3.5 ${isDark ? 'bg-emerald-950/30' : 'bg-emerald-50/80'}`}>
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-emerald-800 dark:text-emerald-300">{t.s2HeapZone}</span>
                <span className="px-2 py-0.5 text-xs font-mono font-extrabold rounded bg-emerald-700 text-white">↑</span>
              </div>
              <p className={`text-xs mt-1 font-semibold ${tokens.textMuted}`}>{t.s2HeapSub}</p>
            </div>

            {/* Zone 3: Code & Static Memory */}
            <div className={`p-3.5 border-t border-slate-300/70 ${isDark ? 'bg-blue-950/30' : 'bg-blue-50'}`}>
              <span className="font-black text-sm text-blue-800 dark:text-sky-300">{t.s2StaticZone}</span>
              <p className={`text-xs mt-0.5 font-semibold ${tokens.textMuted}`}>{t.s2StaticSub}</p>
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-right opacity-70">{t.s2LowAddr}</div>
        </div>

        {/* Column 2: Stack Frame Anatomy */}
        <div className={`col-span-4 p-5 rounded-2xl border flex flex-col justify-between ${tokens.cardBg}`}>
          <h3 className={`text-base font-black flex items-center gap-2 ${tokens.textMain}`}>
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>{t.s2FrameTitle}</span>
          </h3>

          <div className="space-y-3 my-auto">
            <div className={`p-4 rounded-xl border-l-4 border-blue-600 ${tokens.cardSubtle}`}>
              <div className="text-xs font-mono font-black uppercase text-blue-700 dark:text-sky-400">1. ARGUMENTS</div>
              <div className={`text-base font-extrabold mt-0.5 ${tokens.textMain}`}>{t.s2Param}</div>
            </div>

            <div className={`p-4 rounded-xl border-l-4 border-amber-500 ${tokens.cardSubtle}`}>
              <div className="text-xs font-mono font-black uppercase text-amber-700 dark:text-amber-400">2. CONTEXTE LOCAL</div>
              <div className={`text-base font-extrabold mt-0.5 ${tokens.textMain}`}>{t.s2Local}</div>
            </div>

            <div className={`p-4 rounded-xl border-l-4 border-rose-600 ${tokens.cardSubtle}`}>
              <div className="text-xs font-mono font-black uppercase text-rose-700 dark:text-rose-400">3. ADRESSE DE RETOUR</div>
              <div className={`text-base font-extrabold mt-0.5 ${tokens.textMain}`}>{t.s2RetAddr}</div>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border text-xs font-extrabold ${tokens.badgeAmber}`}>
            {t.s2FrameNote}
          </div>
        </div>

        {/* Column 3: Interactive Call Stack Simulator (Starts strictly at 0 frames!) */}
        <div className={`col-span-4 p-5 rounded-2xl border flex flex-col justify-between ${tokens.cardBg}`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-base font-black ${tokens.textMain}`}>{t.s2SimTitle}</h3>
              <span className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg ${isOverflow ? 'bg-red-600 text-white' : tokens.badgeBlue}`}>
                {Math.min(frameCount, MAX_OS_FRAMES)} / {MAX_OS_FRAMES}
              </span>
            </div>
            <div className={`text-xs font-bold ${tokens.textSoft}`}>
              {t.s2Capacity} <strong className={tokens.textMain}>{MAX_OS_FRAMES} {t.s2FramesUnit}</strong>
            </div>
          </div>

          {/* Stack Box */}
          <div className={`flex-1 my-3 rounded-xl border-2 p-3 flex flex-col-reverse gap-2 overflow-hidden relative ${
            isOverflow
              ? 'border-red-600 bg-red-950/20'
              : isDark
              ? 'border-slate-700 bg-slate-900/80'
              : 'border-slate-300 bg-white'
          }`}>
            <div className="absolute top-6 inset-x-0 border-t-2 border-dashed border-red-500 flex justify-end px-2 pointer-events-none">
              <span className="text-[10px] font-mono font-black bg-red-600 text-white px-1.5 py-0.5 rounded -mt-2.5">
                LIMIT OS (5)
              </span>
            </div>

            {frameCount === 0 ? (
              <div className={`m-auto text-center text-sm font-bold px-3 ${tokens.textSoft}`}>
                {t.s2EmptyStack}
              </div>
            ) : (
              Array.from({ length: frameCount }).map((_, idx) => {
                const over = idx >= MAX_OS_FRAMES;
                const nVal = 5 - idx;
                return (
                  <div
                    key={idx}
                    className={`px-3.5 py-2 rounded-lg font-mono text-xs font-extrabold flex items-center justify-between border transition-all ${
                      over
                        ? 'bg-red-600 text-white border-red-700 animate-pulse'
                        : isDark
                        ? 'bg-sky-900/50 text-sky-200 border-sky-700'
                        : 'bg-blue-50 text-blue-900 border-blue-200'
                    }`}
                  >
                    <span>Frame #{idx + 1}</span>
                    <span>f({nVal})</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Alert or Buttons */}
          <div className="space-y-2.5">
            {isOverflow && (
              <div className="p-3 rounded-xl bg-red-600 text-white shadow-md">
                <div className="flex items-center gap-2 font-black text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{t.s2OverflowTitle}</span>
                </div>
                <p className="text-[11px] mt-1 leading-snug font-semibold">{t.s2OverflowMsg}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isOverflow}
                onClick={() => setFrameCount((c) => c + 1)}
                className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs text-white transition ${
                  isOverflow ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                + {t.s2PushBtn}
              </button>
              <button
                type="button"
                onClick={() => setFrameCount(0)}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs border flex items-center gap-1 transition ${tokens.cardSubtle}`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.s2ResetBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================================================
  // SLIDE 3: [1/3 THÉORIE — PART 2] TAIL VS NON-TAIL + SYNCHRONIZED SIMULATOR
  // ==========================================================================
  const renderSlide3 = () => {
    const tailStates = [
      { n: 4, acc: 1 },
      { n: 3, acc: 4 },
      { n: 2, acc: 12 },
      { n: 1, acc: 24 },
      { n: 0, acc: 24 }
    ];
    const currentTail = tailStates[step3 - 1];

    return (
      <div className={`w-[1280px] h-[720px] p-9 flex flex-col justify-between ${tokens.slideBg}`}>
        {renderSlideHeader(t.s3Tag, t.s3Title, t.s3Desc, 3)}

        {/* Top Side-by-Side C Code Comparison */}
        <div className="grid grid-cols-2 gap-6">
          {/* Non-Tail Code */}
          <div className={`p-4 rounded-2xl border-2 ${isDark ? 'border-rose-500/40 bg-rose-950/15' : 'border-rose-200 bg-rose-50/40'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-black text-rose-700 dark:text-rose-400">{t.s3NonTailTitle}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${tokens.badgeCrimson}`}>
                {t.s3NonTailBadge}
              </span>
            </div>
            <p className={`text-xs font-bold mb-2.5 ${tokens.textMuted}`}>{t.s3NonTailDesc}</p>
            <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed" dir="ltr">
              <code>{`int fact(int n) {\n  if (n <= 1) return 1;\n  `}</code>
              <code className="bg-rose-600/40 text-rose-200 px-1 rounded font-bold">{`return n * fact(n - 1);`}</code>
              <code>{` // * n en attente\n}`}</code>
            </pre>
          </div>

          {/* Tail Code */}
          <div className={`p-4 rounded-2xl border-2 ${isDark ? 'border-emerald-500/40 bg-emerald-950/15' : 'border-emerald-300 bg-emerald-50/40'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-black text-emerald-800 dark:text-emerald-400">{t.s3TailTitle}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${tokens.badgeEmerald}`}>
                {t.s3TailBadge}
              </span>
            </div>
            <p className={`text-xs font-bold mb-2.5 ${tokens.textMuted}`}>{t.s3TailDesc}</p>
            <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed" dir="ltr">
              <code>{`int fact_tail(int n, int acc) {\n  if (n <= 1) return acc;\n  `}</code>
              <code className="bg-emerald-600/40 text-emerald-200 px-1 rounded font-bold">{`return fact_tail(n - 1, n * acc);`}</code>
              <code>{` // Dernière action\n}`}</code>
            </pre>
          </div>
        </div>

        {/* Bottom Synchronized Side-by-Side Memory Simulator */}
        <div className={`p-5 rounded-2xl border flex-1 mt-4 flex flex-col justify-between ${tokens.cardBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-black">
              <Zap className="w-4 h-4 text-blue-700" />
              <span>{t.s3SimHeader}</span>
              <span className={`px-2.5 py-0.5 rounded-lg font-mono text-xs border ${tokens.badgeBlue}`}>
                Étape {step3} / 5
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep3((s) => (s >= 5 ? 1 : s + 1))}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5"
              >
                <StepForward className="w-4 h-4" />
                <span>{t.s3StepBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => setStep3(1)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold border flex items-center gap-1 ${tokens.cardSubtle}`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.s3ResetBtn}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 my-auto pt-3">
            {/* Left Lane: Non-Tail Stacking */}
            <div className={`p-4 rounded-xl border ${tokens.cardSubtle}`}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-extrabold text-rose-700 dark:text-rose-400">{t.s3LaneNonTail}</span>
                <span className="font-mono text-xs font-black text-rose-700 dark:text-rose-400">
                  {Math.min(step3, 4)} frame(s) O(n)
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap" dir="ltr">
                {Array.from({ length: Math.min(step3, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-lg border-2 border-rose-500 bg-rose-500/10 font-mono text-xs font-extrabold"
                  >
                    <div>fact({4 - i})</div>
                    <div className="text-[11px] opacity-80">
                      {4 - i === 1 ? 'retourne 1' : `attente: ${4 - i} * ?`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Lane: Tail Single Reused Frame */}
            <div className={`p-4 rounded-xl border ${tokens.cardSubtle}`}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400">{t.s3LaneTail}</span>
                <span className="font-mono text-xs font-black text-emerald-800 dark:text-emerald-400">
                  1 frame O(1)
                </span>
              </div>
              <div className="flex items-center justify-center" dir="ltr">
                <div className="px-5 py-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-600/15 font-mono text-sm font-black flex items-center gap-4">
                  <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-xs">CADRE UNIQUE</span>
                  <span>n = {currentTail.n}</span>
                  <span>acc = {currentTail.acc}</span>
                  {step3 === 5 && <span className="text-emerald-700 dark:text-emerald-300">⇒ Résultat = 24</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // SLIDE 4: [2/3 PRATIQUE — EXEMPLE 1] FIBONACCI (DOUBLE RÉCURSION NON-TERMINALE)
  // ==========================================================================
  const renderSlide4 = () => {
    const dangerPct = Math.min(100, Math.round((Math.log10(fibMetrics.naiveCalls + 1) / 7.5) * 100));

    return (
      <div className={`w-[1280px] h-[720px] p-9 flex flex-col justify-between ${tokens.slideBg}`}>
        {renderSlideHeader(t.s4Tag, t.s4Title, t.s4Desc, 4)}

        {/* Interactive Slider Bar */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-6 ${tokens.cardBg}`}>
          <div className="flex items-center gap-3">
            <span className={`text-base font-extrabold ${tokens.textMain}`}>{t.s4SliderLabel}</span>
            <span className="px-4 py-1.5 rounded-xl bg-blue-700 text-white font-mono text-xl font-black">
              n = {fibN}
            </span>
          </div>

          <input
            type="range"
            min={5}
            max={30}
            value={fibN}
            onChange={(e) => setFibN(Number(e.target.value))}
            className="flex-1 max-w-xl h-2.5 bg-slate-300 rounded-lg cursor-pointer accent-blue-700"
          />

          <div className={`text-base font-mono font-black px-4 py-1.5 rounded-xl border ${tokens.cardSubtle}`}>
            F({fibN}) = <span className="text-blue-700 dark:text-sky-400">{fibMetrics.fn.toLocaleString()}</span>
          </div>
        </div>

        {/* 2-Column Direct Comparison: Double Non-Tail Recursion vs O(1) Iterative */}
        <div className="grid grid-cols-2 gap-6 my-auto">
          {/* Left: Naive Double Non-Tail Recursion */}
          <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between ${isDark ? 'border-rose-500/40 bg-rose-950/15' : 'border-rose-200 bg-rose-50/40'}`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-lg font-black text-rose-700 dark:text-rose-400">{t.s4NaiveTitle}</h3>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border ${tokens.badgeCrimson}`}>
                  O(2ⁿ) / O(n)
                </span>
              </div>
              <p className={`text-xs font-bold mb-3 ${tokens.textMuted}`}>{t.s4NaiveSub}</p>
            </div>

            <div className={`p-4 rounded-xl border my-2 ${tokens.cardSubtle}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-extrabold ${tokens.textSoft}`}>{t.s4NaiveCallsLabel}</span>
                <span className="text-2xl font-mono font-black text-rose-600 dark:text-rose-400">
                  {fibMetrics.naiveCalls.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-600 transition-all duration-200"
                  style={{ width: `${dangerPct}%` }}
                />
              </div>
              <div className={`mt-2.5 space-y-1 text-xs font-extrabold ${tokens.textMuted}`}>
                <div>• {t.s4NaiveTime}</div>
                <div>• {t.s4NaiveSpace}</div>
              </div>
            </div>

            <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed" dir="ltr">
              <code>{`int fib(int n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2); // Double appel non-terminal\n}`}</code>
            </pre>
          </div>

          {/* Right: De-recursed Iterative O(1) */}
          <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between ${isDark ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-emerald-500 bg-emerald-50/40'}`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-lg font-black text-emerald-800 dark:text-emerald-400">{t.s4OptTitle}</h3>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border ${tokens.badgeEmerald}`}>
                  O(n) / O(1)
                </span>
              </div>
              <p className={`text-xs font-bold mb-3 ${tokens.textMuted}`}>{t.s4OptSub}</p>
            </div>

            <div className={`p-4 rounded-xl border my-2 ${tokens.cardSubtle}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-extrabold ${tokens.textSoft}`}>{t.s4OptIterLabel}</span>
                <span className="text-2xl font-mono font-black text-emerald-700 dark:text-emerald-400">
                  {Math.max(0, fibN - 1)} itérations
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-600 w-[8%]" />
              </div>
              <div className={`mt-2.5 space-y-1 text-xs font-extrabold ${tokens.textMuted}`}>
                <div>• {t.s4OptTime}</div>
                <div>• {t.s4OptSpace}</div>
              </div>
            </div>

            <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed" dir="ltr">
              <code>{`int fib_iter(int n) {\n  int a = 0, b = 1, c;\n  for (int i = 2; i <= n; i++) { c = a + b; a = b; b = c; }\n  return (n == 0) ? 0 : b; // Espace constant O(1)\n}`}</code>
            </pre>
          </div>
        </div>

        {/* Bottom Chapter V Takeaway */}
        <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 text-sm font-extrabold ${tokens.badgeBlue}`}>
          <Activity className="w-5 h-5 shrink-0" />
          <span>{t.s4Takeaway}</span>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // SLIDE 5: [2/3 PRATIQUE — EXEMPLE 2] PARCOURS EN PROFONDEUR D'UN ARBRE BINAIRE
  // ==========================================================================
  const renderSlide5 = () => {
    const safeIdx = Math.min(treeStepIdx, treeSteps.length - 1);
    const stepData = treeSteps[safeIdx];

    return (
      <div className={`w-[1280px] h-[720px] p-9 flex flex-col justify-between ${tokens.slideBg}`}>
        {renderSlideHeader(t.s5Tag, t.s5Title, t.s5Desc, 5)}

        {/* Top Interactive Controls Bar */}
        <div className="flex items-center justify-between gap-3 mb-2">
          {/* Mode Switch + Custom Value Input */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setTreeMode('full'); setTreeStepIdx(0); setIsAutoPlaying(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                treeMode === 'full' ? 'bg-blue-700 text-white border-blue-800' : tokens.cardBg
              }`}
            >
              {t.s5ModeFull}
            </button>

            <button
              type="button"
              onClick={() => { setTreeMode('search'); setTreeStepIdx(0); setIsAutoPlaying(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border flex items-center gap-1.5 transition ${
                treeMode === 'search' ? 'bg-emerald-700 text-white border-emerald-800' : tokens.cardBg
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.s5ModeSearch}</span>
            </button>

            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${tokens.cardBg}`}>
              <span className="text-xs font-extrabold">{t.s5TargetLabel}</span>
              <input
                type="number"
                value={targetVal}
                onChange={(e) => {
                  setTargetVal(e.target.value);
                  setTreeMode('search');
                  setTreeStepIdx(0);
                  setIsAutoPlaying(false);
                }}
                className="w-14 px-1.5 py-0.5 rounded bg-white text-slate-900 font-mono text-xs font-black border border-slate-300 outline-none"
              />
            </div>
          </div>

          {/* Step / Auto / Reset Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safeIdx >= treeSteps.length - 1}
              onClick={() => setTreeStepIdx((s) => Math.min(treeSteps.length - 1, s + 1))}
              className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-40 flex items-center gap-1"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span>{t.s5Step}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (safeIdx >= treeSteps.length - 1) setTreeStepIdx(0);
                setIsAutoPlaying((p) => !p);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border flex items-center gap-1 ${tokens.cardBg}`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? t.s5Pause : t.s5Auto}</span>
            </button>

            <button
              type="button"
              onClick={() => { setTreeStepIdx(0); setIsAutoPlaying(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border flex items-center gap-1 ${tokens.cardBg}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.s5Reset}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Stage: Code Mapping | Binary Tree SVG | Manual Stack */}
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          {/* Left Panel (4 cols): Recursive vs Iterative Line Mapping */}
          <div className={`col-span-4 p-4 rounded-2xl border flex flex-col justify-between ${tokens.cardBg}`}>
            <div className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-sky-400">
              {t.s5MapTitle}
            </div>

            <div className="space-y-2.5 my-auto" dir="ltr">
              <div>
                <div className={`text-[11px] font-extrabold mb-1 ${tokens.textSoft}`}>{t.s5RecLabel}</div>
                <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-snug">
                  <code>{`void dfs(Noeud* r) {\n  if (!r) return;\n  afficher(r->val);\n  dfs(r->gauche); // Appel 1\n  dfs(r->droit);  // Appel 2\n}`}</code>
                </pre>
              </div>

              <div className="text-center text-xs font-black text-blue-700 dark:text-sky-400">
                ↓ Transformation LIFO ↓
              </div>

              <div>
                <div className={`text-[11px] font-extrabold mb-1 ${tokens.textSoft}`}>{t.s5IterLabel}</div>
                <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-snug">
                  <code>{`while (!vide(P)) {\n  r = pop(&P);\n  afficher(r->val);\n  if (r->droit)  push(&P, r->droit);\n  if (r->gauche) push(&P, r->gauche);\n}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Center Panel (5 cols): 7-Node Binary Tree SVG */}
          <div className={`col-span-5 p-4 rounded-2xl border flex flex-col justify-between ${tokens.cardBg}`}>
            <svg viewBox="0 0 440 255" className="w-full h-[250px] mx-auto">
              {[
                [50, 30], [50, 70],
                [30, 20], [30, 40],
                [70, 60], [70, 80]
              ].map(([pId, cId], idx) => {
                const p = TREE_NODES[pId];
                const c = TREE_NODES[cId];
                return (
                  <line
                    key={idx}
                    x1={p.x}
                    y1={p.y}
                    x2={c.x}
                    y2={c.y}
                    stroke={isDark ? '#475569' : '#94A3B8'}
                    strokeWidth="3"
                  />
                );
              })}

              {Object.values(TREE_NODES).map((node) => {
                const isCurrent = stepData.current === node.val;
                const isVisited = stepData.visited.includes(node.val);
                const isInStack = stepData.stack.includes(node.val);

                let fill = isDark ? '#1E293B' : '#FFFFFF';
                let stroke = isDark ? '#64748B' : '#475569';
                let textFill = isDark ? '#F8FAFC' : '#0F172A';

                if (isCurrent) {
                  fill = '#047857';
                  stroke = '#065F46';
                  textFill = '#FFFFFF';
                } else if (isVisited) {
                  fill = '#1D4ED8';
                  stroke = '#1E40AF';
                  textFill = '#FFFFFF';
                } else if (isInStack) {
                  fill = isDark ? '#78350F' : '#FEF3C7';
                  stroke = '#D97706';
                  textFill = isDark ? '#FDE68A' : '#92400E';
                }

                return (
                  <g key={node.val}>
                    <circle cx={node.x} cy={node.y} r="24" fill={fill} stroke={stroke} strokeWidth="3.5" />
                    <text
                      x={node.x}
                      y={node.y + 6}
                      textAnchor="middle"
                      fill={textFill}
                      fontSize="16"
                      fontWeight="800"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Visited Sequence Output Bar */}
            <div className={`p-3 rounded-xl border ${tokens.cardSubtle}`}>
              <div className="text-[11px] font-extrabold mb-1.5 text-blue-700 dark:text-sky-400">
                {t.s5OutputTitle}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]" dir="ltr">
                {stepData.visited.length === 0 ? (
                  <span className={`text-xs font-mono ${tokens.textSoft}`}>[ ... ]</span>
                ) : (
                  stepData.visited.map((v, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md bg-blue-700 text-white font-mono text-xs font-black"
                    >
                      {v}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel (3 cols): Pinned OS Call Stack (1 Frame) + Live Manual LIFO Stack */}
          <div className={`col-span-3 p-4 rounded-2xl border flex flex-col justify-between ${tokens.cardBg}`}>
            {/* Pinned OS Call Stack Badge */}
            <div className={`p-2.5 rounded-xl border mb-2.5 ${tokens.badgeEmerald}`}>
              <div className="flex items-center justify-between text-[11px] font-black uppercase">
                <span>{t.s5OsStackTitle}</span>
                <ShieldCheck className="w-4 h-4 shrink-0" />
              </div>
              <div className="font-mono text-xs font-extrabold mt-0.5" dir="ltr">
                {t.s5OsStackPinned}
              </div>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <h3 className={`text-sm font-black flex items-center gap-1.5 ${tokens.textMain}`}>
                <GitBranch className="w-4 h-4 text-blue-700" />
                <span>{t.s5StackTitle}</span>
              </h3>
            </div>

            <div className={`flex-1 rounded-xl border-2 p-2 flex flex-col-reverse gap-1.5 justify-start ${
              isDark ? 'border-slate-700 bg-slate-900/80' : 'border-slate-300 bg-white'
            }`}>
              {stepData.stack.length === 0 ? (
                <div className={`m-auto text-xs font-bold ${tokens.textSoft}`}>{t.s5StackEmpty}</div>
              ) : (
                stepData.stack.map((val, idx) => {
                  const isTop = idx === stepData.stack.length - 1;
                  return (
                    <div
                      key={`${val}-${idx}`}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-black flex items-center justify-between border ${
                        isTop
                          ? 'bg-amber-500 text-white border-amber-600'
                          : isDark
                          ? 'bg-slate-800 text-slate-200 border-slate-700'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      <span>Noeud({val})</span>
                      {isTop && <span className="text-[10px]">{t.s5StackTop}</span>}
                    </div>
                  );
                })
              )}
            </div>

            {treeMode === 'search' && stepData.done && (
              <div className={`mt-2 p-2 rounded-xl text-[11px] font-extrabold ${
                stepData.found ? 'bg-emerald-700 text-white' : tokens.badgeCrimson
              }`}>
                {stepData.found ? t.s5FoundAlert : t.s5NotFoundAlert}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // SLIDE 6: [2/3 PRATIQUE — SYNTHÈSE COMPARATIVE & RÈGLES DE DÉCISION INGÉNIEUR]
  // ==========================================================================
  const renderSlide6 = () => {
    return (
      <div className={`w-[1280px] h-[720px] p-9 flex flex-col justify-between ${tokens.slideBg}`}>
        {renderSlideHeader(t.s6Tag, t.s6Title, t.s6Desc, 6)}

        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Left Panel (7 cols): Complexity Comparison Matrix */}
          <div className={`col-span-7 p-5 rounded-2xl border flex flex-col justify-between ${tokens.cardBg}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-base font-black flex items-center gap-2 ${tokens.textMain}`}>
                  <Activity className="w-5 h-5 text-blue-700 dark:text-sky-400" />
                  <span>{t.s6MatrixTitle}</span>
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold border ${tokens.badgeBlue}`}>
                  O(n) • O(h) • O(1)
                </span>
              </div>

              <div className="rounded-xl border overflow-hidden border-slate-300/80 dark:border-slate-700 shadow-sm">
                <table className="w-full text-start border-collapse text-xs">
                  <thead>
                    <tr className="bg-blue-700 text-white">
                      <th className="p-3 text-start font-black">{t.s6ColApproach}</th>
                      <th className="p-3 text-center font-black">{t.s6ColTime}</th>
                      <th className="p-3 text-center font-black">{t.s6ColSpace}</th>
                      <th className="p-3 text-end font-black">{t.s6ColRisk}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-bold">
                    {/* Row 1: Récursion Non-Terminale */}
                    <tr className={tokens.cardSubtle}>
                      <td className="p-3 font-extrabold">
                        <div className="text-slate-900 dark:text-slate-100">{t.s6Row1Name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">Ex: fact(n), fib(n), dfs(arbre)</div>
                      </td>
                      <td className="p-3 text-center font-mono font-extrabold">{t.s6Row1Time}</td>
                      <td className="p-3 text-center text-rose-700 dark:text-rose-400 font-mono font-black">
                        {t.s6Row1Space}
                      </td>
                      <td className="p-3 text-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.s6Row1Risk}</span>
                        </span>
                      </td>
                    </tr>

                    {/* Row 2: Récursion Terminale */}
                    <tr className={tokens.cardSubtle}>
                      <td className="p-3 font-extrabold">
                        <div className="text-slate-900 dark:text-slate-100">{t.s6Row2Name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">Ex: fact_tail(n, acc)</div>
                      </td>
                      <td className="p-3 text-center font-mono font-extrabold">{t.s6Row2Time}</td>
                      <td className="p-3 text-center text-emerald-700 dark:text-emerald-400 font-mono font-black">
                        {t.s6Row2Space}
                      </td>
                      <td className="p-3 text-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.s6Row2Risk}</span>
                        </span>
                      </td>
                    </tr>

                    {/* Row 3: Dé-récursivation (Boucle + Pile Manuelle) */}
                    <tr className={tokens.cardSubtle}>
                      <td className="p-3 font-extrabold">
                        <div className="text-blue-700 dark:text-sky-400">{t.s6Row3Name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">Ex: DFS Arbre (while + LIFO)</div>
                      </td>
                      <td className="p-3 text-center font-mono font-extrabold text-blue-700 dark:text-sky-400">
                        {t.s6Row3Time}
                      </td>
                      <td className="p-3 text-center text-blue-700 dark:text-sky-400 font-mono font-black">
                        {t.s6Row3Space}
                      </td>
                      <td className="p-3 text-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-blue-500/15 text-blue-800 dark:text-sky-300 border border-blue-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.s6Row3Risk}</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`p-3 rounded-xl border-l-4 border-blue-600 text-xs font-bold leading-relaxed ${tokens.badgeBlue}`}>
              {t.s6MatrixNote}
            </div>
          </div>

          {/* Right Panel (5 cols): 3 Concise, Closed Engineering Decision Rules */}
          <div className={`col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${tokens.cardBg}`}>
            <div>
              <h3 className={`text-base font-black flex items-center gap-2 mb-2.5 ${tokens.textMain}`}>
                <Workflow className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>{t.s6RulesTitle}</span>
              </h3>

              <div className="space-y-2.5">
                {/* Rule 1: Tail -> Loop O(1) */}
                <div className={`p-3 rounded-xl border ${tokens.cardSubtle}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border ${tokens.badgeEmerald}`}>
                      {t.s6Rule1Badge}
                    </span>
                    <span className="font-mono text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                      O(1) Mémoire
                    </span>
                  </div>
                  <h4 className={`text-xs font-black leading-snug ${tokens.textMain}`}>
                    {t.s6Rule1Title}
                  </h4>
                  <p className={`text-[11px] font-semibold mt-0.5 leading-relaxed ${tokens.textMuted}`}>
                    {t.s6Rule1Desc}
                  </p>
                </div>

                {/* Rule 2: Non-Tail -> while + manual stack in reverse push order */}
                <div className={`p-3 rounded-xl border ${tokens.cardSubtle}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border ${tokens.badgeBlue}`}>
                      {t.s6Rule2Badge}
                    </span>
                    <span className="font-mono text-[11px] font-black text-blue-700 dark:text-sky-400">
                      LIFO Inversé
                    </span>
                  </div>
                  <h4 className={`text-xs font-black leading-snug ${tokens.textMain}`}>
                    {t.s6Rule2Title}
                  </h4>
                  <p className={`text-[11px] font-semibold mt-0.5 leading-relaxed ${tokens.textMuted}`}>
                    {t.s6Rule2Desc}
                  </p>
                </div>

                {/* Rule 3: push/pop in O(1) preserves asymptotic time */}
                <div className={`p-3 rounded-xl border ${tokens.cardSubtle}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border ${tokens.badgeAmber}`}>
                      {t.s6Rule3Badge}
                    </span>
                    <span className="font-mono text-[11px] font-black text-amber-700 dark:text-amber-400">
                      O(1) Opérations
                    </span>
                  </div>
                  <h4 className={`text-xs font-black leading-snug ${tokens.textMain}`}>
                    {t.s6Rule3Title}
                  </h4>
                  <p className={`text-[11px] font-semibold mt-0.5 leading-relaxed ${tokens.textMuted}`}>
                    {t.s6Rule3Desc}
                  </p>
                </div>
              </div>
            </div>

            <div className={`mt-1.5 px-3 py-1 rounded-lg text-[11px] font-bold text-center ${tokens.textSoft}`}>
              {lang === 'ar' ? 'الخلاصة : الحفاظ على التعقيد الزمني O(n) وتأمين استقرار نظام التشغيل بنسبة 100%' : lang === 'en' ? 'Takeaway: Preserves O(n) runtime with 100% OS crash prevention' : 'Bilan : Préservation du temps O(n) et 100% de protection contre le crash OS'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const slides = [
    renderSlide1,
    renderSlide2,
    renderSlide3,
    renderSlide4,
    renderSlide5,
    renderSlide6
  ];

  return (
    <div
      dir={t.dir}
      className={`h-screen w-screen flex flex-col select-none overflow-hidden transition-colors duration-200 ${tokens.appBg}`}
      style={{
        fontFamily:
          lang === 'ar'
            ? "'Cairo', 'Plus Jakarta Sans', sans-serif"
            : "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Google Fonts Preconnect & Stylesheet */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
      `}</style>

      {/* Top Navigation Bar */}
      <header className={`w-full px-4 py-2 border-b flex flex-wrap items-center justify-between gap-3 z-20 shrink-0 ${tokens.toolbarBg}`}>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-blue-700 text-white text-xs font-black tracking-wide">
            {t.exposeBadge}
          </span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-7 bg-blue-700' : 'w-2.5 bg-slate-400/50 hover:bg-slate-400'
                }`}
                aria-label={`${t.slideLabel} ${idx + 1}`}
              />
            ))}
          </div>
          <span className={`text-xs font-extrabold ${tokens.textSoft}`}>
            {t.slideLabel} {currentSlide + 1} / 6
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher: FR / AR / EN */}
          <div className={`flex items-center rounded-xl border p-0.5 ${tokens.cardBg}`}>
            {(['fr', 'ar', 'en']).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase transition ${
                  lang === code ? 'bg-blue-700 text-white shadow-sm' : `${tokens.textMuted} hover:opacity-80`
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Daylight / Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border flex items-center gap-1.5 transition ${tokens.cardBg}`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-700" />}
            <span>{isDark ? t.daylightMode : t.darkMode}</span>
          </button>

          {/* Fullscreen Toggle for Lecture Hall Projection */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border flex items-center gap-1.5 transition ${tokens.cardBg}`}
            title={isFullscreen ? t.exitFullscreenBtn : t.fullscreenBtn}
            aria-label={isFullscreen ? t.exitFullscreenBtn : t.fullscreenBtn}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-700" /> : <Maximize2 className="w-4 h-4 text-blue-700" />}
            <span className="hidden sm:inline">{isFullscreen ? t.exitFullscreenBtn : t.fullscreenBtn}</span>
          </button>
        </div>
      </header>

      {/* Main 16:9 Scaled Stage */}
      <main
        ref={stageWrapperRef}
        className="flex-1 flex items-center justify-center relative overflow-hidden p-2 sm:p-3"
      >
        <button
          type="button"
          disabled={currentSlide === 0}
          onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
          className={`fixed ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border shadow-lg transition disabled:opacity-25 ${tokens.toolbarBg} hover:scale-105`}
          aria-label="Previous slide"
        >
          {lang === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>

        <div style={{ width: 1280 * scale, height: 720 * scale }} className="relative flex items-center justify-center">
          <div
            style={{
              width: 1280,
              height: 720,
              transform: `scale(${scale})`,
              transformOrigin: 'center center'
            }}
            className="rounded-2xl shadow-2xl border overflow-hidden shrink-0"
          >
            {slides[currentSlide]()}
          </div>
        </div>

        <button
          type="button"
          disabled={currentSlide === 5}
          onClick={() => setCurrentSlide((s) => Math.min(5, s + 1))}
          className={`fixed ${lang === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border shadow-lg transition disabled:opacity-25 ${tokens.toolbarBg} hover:scale-105`}
          aria-label="Next slide"
        >
          {lang === 'ar' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </main>
    </div>
  );
}
