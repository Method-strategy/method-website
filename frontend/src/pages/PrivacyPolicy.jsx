import { RevealStagger, RevealItem } from "../components/Reveal";

const EMAIL = "connect@methodmarketinggroup.com";

const toc = [
    { id: "info-collect", label: "What information do we collect?" },
    { id: "process-info", label: "How do we process your information?" },
    { id: "share-info", label: "When and with whom do we share your personal information?" },
    { id: "cookies", label: "Do we use cookies and other tracking technologies?" },
    { id: "retention", label: "How long do we keep your information?" },
    { id: "safety", label: "How do we keep your information safe?" },
    { id: "minors", label: "Do we collect information from minors?" },
    { id: "privacy-rights", label: "What are your privacy rights?" },
    { id: "dnt", label: "Controls for Do-Not-Track features" },
    { id: "us-rights", label: "Do United States residents have specific privacy rights?" },
    { id: "updates", label: "Do we make updates to this notice?" },
    { id: "contact", label: "How can you contact us about this notice?" },
    { id: "review-data", label: "How can you review, update, or delete the data we collect from you?" },
];

const categories = [
    ["A. Identifiers", "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name"],
    ["B. Personal information as defined in the California Customer Records statute", "Name, contact information, education, employment, employment history, and financial information"],
    ["C. Protected classification characteristics under state or federal law", "Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data"],
    ["D. Commercial information", "Transaction information, purchase history, financial details, and payment information"],
    ["E. Biometric information", "Fingerprints and voiceprints"],
    ["F. Internet or other similar network activity", "Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements"],
    ["G. Geolocation data", "Device location"],
    ["H. Audio, electronic, sensory, or similar information", "Images and audio, video or call recordings created in connection with our business activities"],
    ["I. Professional or employment-related information", "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us"],
    ["J. Education information", "Student records and directory information"],
    ["K. Inferences drawn from collected personal information", "Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual's preferences and characteristics"],
    ["L. Sensitive personal information", "—"],
];

const Email = () => (
    <a href={`mailto:${EMAIL}`} className="ed-link">
        {EMAIL}
    </a>
);

const Anchor = ({ id, children }) => (
    <a href={`#${id}`} className="ed-link">
        {children}
    </a>
);

const Section = ({ id, num, title, children }) => (
    <section id={id} className="scroll-mt-28 pt-12 md:pt-16">
        <h2 className="wordmark text-2xl md:text-3xl leading-tight tracking-tight text-navy mb-6">
            {num}. {title}
        </h2>
        <div className="prose-method space-y-5">{children}</div>
    </section>
);

const InShort = ({ children }) => (
    <p className="serif italic text-lg text-steel">In Short: {children}</p>
);

export default function PrivacyPolicy() {
    return (
        <main data-testid="privacy-policy-page" className="bg-cream text-navy">
            <section className="row-full bg-cream">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-20 md:pb-28">
                    <RevealStagger stagger={0.12}>
                        <RevealItem>
                            <div className="eyebrow text-navy/60 mb-8">Legal</div>
                            <h1 className="wordmark text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight">
                                Privacy
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    Policy.
                                </span>
                            </h1>
                            <p className="text-sm text-navy/60 mt-6 tracking-wide uppercase">
                                Last updated July 8, 2026
                            </p>
                        </RevealItem>
                    </RevealStagger>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 mt-16 md:mt-20 items-start">
                        {/* Sticky TOC sidebar */}
                        <aside
                            data-testid="privacy-toc-sidebar"
                            className="lg:col-span-3 lg:sticky lg:top-28 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto mb-14 lg:mb-0 lg:pr-6"
                        >
                            <div className="eyebrow text-navy/60 mb-5">
                                Contents
                            </div>
                            <ol className="space-y-2.5">
                                {toc.map((t, i) => (
                                    <li key={t.id} className="flex gap-2.5 items-baseline">
                                        <span className="text-xs text-navy/40 tabular-nums shrink-0">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <a
                                            href={`#${t.id}`}
                                            data-testid={`privacy-toc-${t.id}`}
                                            className="nav-link text-sm leading-snug text-navy/75 hover:text-navy"
                                        >
                                            {t.label}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </aside>

                        <div className="lg:col-span-8 lg:col-start-5">
                            <div className="prose-method space-y-5">
                                <p>
                                    This Privacy Notice for Method Marketing Group LLC
                                    (doing business as Method) ("we," "us," or "our"),
                                    describes how and why we might access, collect,
                                    store, use, and/or share ("process") your personal
                                    information when you use our services ("Services"),
                                    including when you:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        Visit our website at{" "}
                                        <a href="https://methodmarketinggroup.com" className="ed-link">
                                            methodmarketinggroup.com
                                        </a>{" "}
                                        or any website of ours that links to this
                                        Privacy Notice
                                    </li>
                                    <li>
                                        Engage with us in other related ways, including
                                        any marketing or events
                                    </li>
                                </ul>
                                <p>
                                    <strong>Questions or concerns?</strong> Reading this
                                    Privacy Notice will help you understand your privacy
                                    rights and choices. We are responsible for making
                                    decisions about how your personal information is
                                    processed. If you do not agree with our policies and
                                    practices, please do not use our Services. If you
                                    still have any questions or concerns, please contact
                                    us at <Email />.
                                </p>
                            </div>

                            {/* Summary of key points */}
                            <div className="mt-14 pt-10 border-t border-navy/15">
                                <h2 className="wordmark text-2xl md:text-3xl leading-tight tracking-tight text-navy mb-6">
                                    Summary of key points
                                </h2>
                                <div className="prose-method space-y-5">
                                    <p className="serif italic text-lg text-steel">
                                        This summary provides key points from our
                                        Privacy Notice, but you can find out more
                                        details about any of these topics by clicking
                                        the link following each key point or by using
                                        our table of contents below to find the section
                                        you are looking for.
                                    </p>
                                    <p>
                                        <strong>What personal information do we process?</strong>{" "}
                                        When you visit, use, or navigate our Services, we
                                        may process personal information depending on how
                                        you interact with us and the Services, the choices
                                        you make, and the products and features you use.{" "}
                                        <Anchor id="info-collect">
                                            Learn more about personal information you disclose to us
                                        </Anchor>.
                                    </p>
                                    <p>
                                        <strong>Do we process any sensitive personal information?</strong>{" "}
                                        Some of the information may be considered "special"
                                        or "sensitive" in certain jurisdictions, for example
                                        your racial or ethnic origins, sexual orientation,
                                        and religious beliefs. We do not process sensitive
                                        personal information.
                                    </p>
                                    <p>
                                        <strong>Do we collect any information from third parties?</strong>{" "}
                                        We do not collect any information from third parties.
                                    </p>
                                    <p>
                                        <strong>How do we process your information?</strong>{" "}
                                        We process your information to provide, improve, and
                                        administer our Services, communicate with you, for
                                        security and fraud prevention, and to comply with
                                        law. We may also process your information for other
                                        purposes with your consent. We process your
                                        information only when we have a valid legal reason
                                        to do so.{" "}
                                        <Anchor id="process-info">
                                            Learn more about how we process your information
                                        </Anchor>.
                                    </p>
                                    <p>
                                        <strong>In what situations and with which parties do we share personal information?</strong>{" "}
                                        We may share information in specific situations and
                                        with specific third parties.{" "}
                                        <Anchor id="share-info">
                                            Learn more about when and with whom we share your personal information
                                        </Anchor>.
                                    </p>
                                    <p>
                                        <strong>How do we keep your information safe?</strong>{" "}
                                        We have adequate organizational and technical
                                        processes and procedures in place to protect your
                                        personal information. However, no electronic
                                        transmission over the internet or information
                                        storage technology can be guaranteed to be 100%
                                        secure, so we cannot promise or guarantee that
                                        hackers, cybercriminals, or other unauthorized
                                        third parties will not be able to defeat our
                                        security and improperly collect, access, steal, or
                                        modify your information.{" "}
                                        <Anchor id="safety">
                                            Learn more about how we keep your information safe
                                        </Anchor>.
                                    </p>
                                    <p>
                                        <strong>What are your rights?</strong> Depending on
                                        where you are located geographically, the applicable
                                        privacy law may mean you have certain rights
                                        regarding your personal information.{" "}
                                        <Anchor id="privacy-rights">
                                            Learn more about your privacy rights
                                        </Anchor>.
                                    </p>
                                    <p>
                                        <strong>How do you exercise your rights?</strong>{" "}
                                        The easiest way to exercise your rights is by
                                        submitting a data subject access request, or by
                                        contacting us. We will consider and act upon any
                                        request in accordance with applicable data
                                        protection laws.
                                    </p>
                                    <p>
                                        Want to learn more about what we do with any
                                        information we collect? Review the Privacy Notice
                                        in full below.
                                    </p>
                                </div>
                            </div>

                            <Section id="info-collect" num={1} title="What information do we collect?">
                                <h3 className="serif italic text-xl text-navy">
                                    Personal information you disclose to us
                                </h3>
                                <InShort>We collect personal information that you provide to us.</InShort>
                                <p>
                                    We collect personal information that you voluntarily
                                    provide to us when you express an interest in
                                    obtaining information about us or our products and
                                    Services, when you participate in activities on the
                                    Services, or otherwise when you contact us.
                                </p>
                                <p>
                                    <strong>Personal Information Provided by You.</strong>{" "}
                                    The personal information that we collect depends on
                                    the context of your interactions with us and the
                                    Services, the choices you make, and the products and
                                    features you use. The personal information we collect
                                    may include the following:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>email addresses</li>
                                    <li>names</li>
                                </ul>
                                <p>
                                    <strong>Sensitive Information.</strong> We do not
                                    process sensitive information.
                                </p>
                                <p>
                                    All personal information that you provide to us must
                                    be true, complete, and accurate, and you must notify
                                    us of any changes to such personal information.
                                </p>
                                <h3 className="serif italic text-xl text-navy">
                                    Information automatically collected
                                </h3>
                                <InShort>
                                    Some information — such as your Internet Protocol
                                    (IP) address, browser and device characteristics,
                                    and how you navigate the site — is collected
                                    automatically when you visit our Services.
                                </InShort>
                                <p>
                                    We automatically collect certain information when
                                    you visit, use, or navigate the Services. This
                                    information does not reveal your specific identity
                                    (like your name or contact information) but may
                                    include device and usage information, such as your
                                    IP address, browser and device characteristics,
                                    operating system, language preferences, referring
                                    URLs, the pages you view within our Services, the
                                    order in which you view them, and information
                                    about how and when you use our Services. This
                                    information is primarily needed to maintain the
                                    security and operation of our Services, and for
                                    our internal analytics and reporting purposes. Our
                                    analytics providers are Google Analytics 4 (traffic
                                    measurement) and Microsoft Clarity (session replay
                                    and interaction heatmaps) — see section{" "}
                                    <Anchor id="cookies">
                                        "Do we use cookies and other tracking technologies?"
                                    </Anchor>{" "}
                                    for details on what each collects and how to opt
                                    out.
                                </p>
                            </Section>

                            <Section id="process-info" num={2} title="How do we process your information?">
                                <InShort>
                                    We process your information to provide, improve, and
                                    administer our Services, communicate with you, for
                                    security and fraud prevention, and to comply with
                                    law. We may also process your information for other
                                    purposes with your consent.
                                </InShort>
                                <p>
                                    We process your personal information for a variety of
                                    reasons, depending on how you interact with our
                                    Services, including:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        <strong>To deliver and facilitate delivery of services to the user.</strong>{" "}
                                        We may process your information to provide you
                                        with the requested service.
                                    </li>
                                    <li>
                                        <strong>To respond to user inquiries/offer support to users.</strong>{" "}
                                        We may process your information to respond to your
                                        inquiries and solve any potential issues you might
                                        have with the requested service.
                                    </li>
                                    <li>
                                        <strong>To enable user-to-user communications.</strong>{" "}
                                        We may process your information if you choose to
                                        use any of our offerings that allow for
                                        communication with another user.
                                    </li>
                                </ul>
                            </Section>

                            <Section id="share-info" num={3} title="When and with whom do we share your personal information?">
                                <InShort>
                                    We may share information in specific situations
                                    described in this section and/or with the following
                                    third parties.
                                </InShort>
                                <p>
                                    We may need to share your personal information in the
                                    following situations:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        <strong>Business Transfers.</strong> We may share
                                        or transfer your information in connection with,
                                        or during negotiations of, any merger, sale of
                                        company assets, financing, or acquisition of all
                                        or a portion of our business to another company.
                                    </li>
                                </ul>
                            </Section>

                            <Section id="cookies" num={4} title="Do we use cookies and other tracking technologies?">
                                <InShort>
                                    Yes. We use Google Analytics 4 to
                                    understand aggregate traffic patterns and
                                    Microsoft Clarity to understand
                                    interaction patterns (clicks, scrolls,
                                    session replays). Both set cookies to
                                    make that measurement possible.
                                </InShort>
                                <p>
                                    We use cookies and similar tracking
                                    technologies (like web beacons and pixels)
                                    to gather information when you interact
                                    with our Services. Some online tracking
                                    technologies help us maintain the security
                                    of our Services, prevent crashes, fix bugs,
                                    save your preferences, and assist with
                                    basic site functions. We also permit third
                                    parties and service providers to use
                                    online tracking technologies on our
                                    Services for analytics — see the Google
                                    Analytics disclosure below. We do not use
                                    online tracking for advertising, retargeting,
                                    profiling, or any form of ad personalization.
                                </p>
                                <p>
                                    To the extent these online tracking technologies are
                                    deemed to be a "sale"/"sharing" (which includes
                                    targeted advertising, as defined under the applicable
                                    laws) under applicable US state laws, you can opt out
                                    of these online tracking technologies by submitting a
                                    request as described below under section{" "}
                                    <Anchor id="us-rights">
                                        "Do United States residents have specific privacy rights?"
                                    </Anchor>
                                </p>
                                <p>
                                    <strong>Google Analytics.</strong> We use
                                    Google Analytics 4 (measurement ID
                                    G-7F2PPZPXSK) to measure aggregate site
                                    traffic and understand which pages are
                                    read. When you visit the site, Google
                                    Analytics automatically collects a limited
                                    set of information about your visit,
                                    including your approximate location
                                    (derived from your IP address, which
                                    Google truncates), the pages you view, how
                                    you arrived on the site (referrer),
                                    device and browser characteristics, and
                                    the sequence of pages you visit within a
                                    session. Google Analytics sets first-party
                                    cookies (typically named{" "}
                                    <code>_ga</code> and{" "}
                                    <code>_ga_&lt;container-id&gt;</code>) to
                                    distinguish unique visitors and sessions.
                                    We do not use this data for advertising,
                                    remarketing, or ad personalization, and
                                    we have not enabled Google Signals or
                                    cross-device tracking. To opt out of
                                    being tracked by Google Analytics across
                                    the Services, visit{" "}
                                    <a
                                        href="https://tools.google.com/dlpage/gaoptout"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ed-link"
                                    >
                                        tools.google.com/dlpage/gaoptout
                                    </a>
                                    . For more information on the privacy practices of
                                    Google, please visit the{" "}
                                    <a
                                        href="https://policies.google.com/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ed-link"
                                    >
                                        Google Privacy &amp; Terms page
                                    </a>
                                    .
                                </p>
                                <p>
                                    <strong>Microsoft Clarity.</strong> We use
                                    Microsoft Clarity (project ID
                                    xj8oadt46d) to understand how visitors
                                    interact with the site through session
                                    replay, click and scroll heatmaps, and
                                    aggregated interaction metrics. When you
                                    visit the site, Clarity captures a
                                    recording of your interactions — mouse
                                    movements, clicks, scrolls, and the pages
                                    you view — along with your approximate
                                    location (derived from your IP address),
                                    device and browser characteristics, and
                                    referrer. Clarity sets first-party
                                    cookies (typically{" "}
                                    <code>_clck</code>, <code>_clsk</code>)
                                    and reads Microsoft's own third-party
                                    cookies (such as <code>MUID</code>,{" "}
                                    <code>ANONCHK</code>, <code>CLID</code>,
                                    <code>SM</code>, <code>MR</code>) to
                                    identify unique users and stitch
                                    interactions into continuous sessions.
                                    Recordings do not capture keystrokes in
                                    input fields by default, and sensitive
                                    content is masked. Data is processed by
                                    Microsoft on our behalf. We do not use
                                    Clarity data for advertising, retargeting,
                                    profiling, or ad personalization. For
                                    more information on Clarity's privacy
                                    practices, see Microsoft's{" "}
                                    <a
                                        href="https://privacy.microsoft.com/privacystatement"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ed-link"
                                    >
                                        Privacy Statement
                                    </a>{" "}
                                    and the{" "}
                                    <a
                                        href="https://learn.microsoft.com/en-us/clarity/setup-and-installation/faq#privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ed-link"
                                    >
                                        Clarity privacy FAQ
                                    </a>
                                    .
                                </p>
                            </Section>

                            <Section id="retention" num={5} title="How long do we keep your information?">
                                <InShort>
                                    We keep your information for as long as necessary to
                                    fulfill the purposes outlined in this Privacy Notice
                                    unless otherwise required by law.
                                </InShort>
                                <p>
                                    We will only keep your personal information for as
                                    long as it is necessary for the purposes set out in
                                    this Privacy Notice, unless a longer retention period
                                    is required or permitted by law (such as tax,
                                    accounting, or other legal requirements). When we
                                    have no ongoing legitimate business need to process
                                    your personal information, we will either delete or
                                    anonymize such information, or, if this is not
                                    possible (for example, because your personal
                                    information has been stored in backup archives), then
                                    we will securely store your personal information and
                                    isolate it from any further processing until deletion
                                    is possible.
                                </p>
                            </Section>

                            <Section id="safety" num={6} title="How do we keep your information safe?">
                                <InShort>
                                    We aim to protect your personal information through a
                                    system of organizational and technical security
                                    measures.
                                </InShort>
                                <p>
                                    We have implemented appropriate and reasonable
                                    technical and organizational security measures
                                    designed to protect the security of any personal
                                    information we process. However, despite our
                                    safeguards and efforts to secure your information, no
                                    electronic transmission over the Internet or
                                    information storage technology can be guaranteed to
                                    be 100% secure, so we cannot promise or guarantee
                                    that hackers, cybercriminals, or other unauthorized
                                    third parties will not be able to defeat our security
                                    and improperly collect, access, steal, or modify your
                                    information. Although we will do our best to protect
                                    your personal information, transmission of personal
                                    information to and from our Services is at your own
                                    risk. You should only access the Services within a
                                    secure environment.
                                </p>
                            </Section>

                            <Section id="minors" num={7} title="Do we collect information from minors?">
                                <InShort>
                                    We do not knowingly collect data from or market to
                                    children under 18 years of age.
                                </InShort>
                                <p>
                                    We do not knowingly collect, solicit data from, or
                                    market to children under 18 years of age, nor do we
                                    knowingly sell such personal information. By using
                                    the Services, you represent that you are at least 18
                                    or that you are the parent or guardian of such a
                                    minor and consent to such minor dependent's use of
                                    the Services. If we learn that personal information
                                    from users less than 18 years of age has been
                                    collected, we will deactivate the account and take
                                    reasonable measures to promptly delete such data from
                                    our records. If you become aware of any data we may
                                    have collected from children under age 18, please
                                    contact us at <Email />.
                                </p>
                            </Section>

                            <Section id="privacy-rights" num={8} title="What are your privacy rights?">
                                <InShort>
                                    You may review, change, or terminate your account at
                                    any time, depending on your country, province, or
                                    state of residence.
                                </InShort>
                                <p>
                                    <strong>Withdrawing your consent:</strong> If we are
                                    relying on your consent to process your personal
                                    information, which may be express and/or implied
                                    consent depending on the applicable law, you have the
                                    right to withdraw your consent at any time. You can
                                    withdraw your consent at any time by contacting us by
                                    using the contact details provided in the section{" "}
                                    <Anchor id="contact">
                                        "How can you contact us about this notice?"
                                    </Anchor>{" "}
                                    below.
                                </p>
                                <p>
                                    However, please note that this will not affect the
                                    lawfulness of the processing before its withdrawal
                                    nor, when applicable law allows, will it affect the
                                    processing of your personal information conducted in
                                    reliance on lawful processing grounds other than
                                    consent.
                                </p>
                                <p>
                                    If you have questions or comments about your privacy
                                    rights, you may email us at <Email />.
                                </p>
                            </Section>

                            <Section id="dnt" num={9} title="Controls for Do-Not-Track features">
                                <p>
                                    Most web browsers and some mobile operating systems
                                    and mobile applications include a Do-Not-Track
                                    ("DNT") feature or setting you can activate to signal
                                    your privacy preference not to have data about your
                                    online browsing activities monitored and collected.
                                    At this stage, no uniform technology standard for
                                    recognizing and implementing DNT signals has been
                                    finalized. As such, we do not currently respond to
                                    DNT browser signals or any other mechanism that
                                    automatically communicates your choice not to be
                                    tracked online. If a standard for online tracking is
                                    adopted that we must follow in the future, we will
                                    inform you about that practice in a revised version
                                    of this Privacy Notice.
                                </p>
                                <p>
                                    California law requires us to let you know how we
                                    respond to web browser DNT signals. Because there
                                    currently is not an industry or legal standard for
                                    recognizing or honoring DNT signals, we do not
                                    respond to them at this time.
                                </p>
                            </Section>

                            <Section id="us-rights" num={10} title="Do United States residents have specific privacy rights?">
                                <InShort>
                                    If you are a resident of California, Colorado,
                                    Connecticut, Delaware, Florida, Indiana, Iowa,
                                    Kentucky, Maryland, Minnesota, Montana, Nebraska, New
                                    Hampshire, New Jersey, Oregon, Rhode Island,
                                    Tennessee, Texas, Utah, or Virginia, you may have the
                                    right to request access to and receive details about
                                    the personal information we maintain about you and
                                    how we have processed it, correct inaccuracies, get a
                                    copy of, or delete your personal information. You may
                                    also have the right to withdraw your consent to our
                                    processing of your personal information. These rights
                                    may be limited in some circumstances by applicable
                                    law. More information is provided below.
                                </InShort>
                                <h3 className="serif italic text-xl text-navy">
                                    Categories of personal information we collect
                                </h3>
                                <p>
                                    The table below shows the categories of personal
                                    information we have collected in the past twelve (12)
                                    months. The table includes illustrative examples of
                                    each category and does not reflect the personal
                                    information we collect from you. For a comprehensive
                                    inventory of all personal information we process,
                                    please refer to the section{" "}
                                    <Anchor id="info-collect">
                                        "What information do we collect?"
                                    </Anchor>
                                </p>
                                <div className="overflow-x-auto">
                                    <table
                                        data-testid="privacy-categories-table"
                                        className="w-full text-sm border-collapse"
                                    >
                                        <thead>
                                            <tr className="border-b border-navy/25 text-left">
                                                <th className="py-3 pr-4 font-medium uppercase tracking-wider text-xs text-navy/60">Category</th>
                                                <th className="py-3 pr-4 font-medium uppercase tracking-wider text-xs text-navy/60">Examples</th>
                                                <th className="py-3 font-medium uppercase tracking-wider text-xs text-navy/60">Collected</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map(([cat, ex]) => (
                                                <tr key={cat} className="border-b border-navy/10 align-top">
                                                    <td className="py-3 pr-4 font-medium">{cat}</td>
                                                    <td className="py-3 pr-4 text-navy/75">{ex}</td>
                                                    <td className="py-3 whitespace-nowrap">NO</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p>
                                    We may also collect other personal information
                                    outside of these categories through instances where
                                    you interact with us in person, online, or by phone
                                    or mail in the context of:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Receiving help through our customer support channels;</li>
                                    <li>Participation in customer surveys or contests; and</li>
                                    <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
                                </ul>
                                <h3 className="serif italic text-xl text-navy">
                                    Sources of personal information
                                </h3>
                                <p>
                                    Learn more about the sources of personal information
                                    we collect in{" "}
                                    <Anchor id="info-collect">
                                        "What information do we collect?"
                                    </Anchor>
                                </p>
                                <h3 className="serif italic text-xl text-navy">
                                    How we use and share personal information
                                </h3>
                                <p>
                                    Learn more about how we use your personal information
                                    in the section{" "}
                                    <Anchor id="process-info">
                                        "How do we process your information?"
                                    </Anchor>
                                </p>
                                <p>
                                    <strong>Will your information be shared with anyone else?</strong>{" "}
                                    We may disclose your personal information with our
                                    service providers pursuant to a written contract
                                    between us and each service provider. Learn more
                                    about how we disclose personal information in the
                                    section{" "}
                                    <Anchor id="share-info">
                                        "When and with whom do we share your personal information?"
                                    </Anchor>
                                </p>
                                <p>
                                    We may use your personal information for our own
                                    business purposes, such as for undertaking internal
                                    research for technological development and
                                    demonstration. This is not considered to be "selling"
                                    of your personal information. We have not disclosed,
                                    sold, or shared any personal information to third
                                    parties for a business or commercial purpose in the
                                    preceding twelve (12) months. We will not sell or
                                    share personal information in the future belonging to
                                    website visitors, users, and other consumers.
                                </p>
                                <h3 className="serif italic text-xl text-navy">Your rights</h3>
                                <p>
                                    You have rights under certain US state data
                                    protection laws. However, these rights are not
                                    absolute, and in certain cases, we may decline your
                                    request as permitted by law. These rights include:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Right to know whether or not we are processing your personal data</li>
                                    <li>Right to access your personal data</li>
                                    <li>Right to correct inaccuracies in your personal data</li>
                                    <li>Right to request the deletion of your personal data</li>
                                    <li>Right to obtain a copy of the personal data you previously shared with us</li>
                                    <li>Right to non-discrimination for exercising your rights</li>
                                    <li>
                                        Right to opt out of the processing of your
                                        personal data if it is used for targeted
                                        advertising (or sharing as defined under
                                        California's privacy law), the sale of personal
                                        data, or profiling in furtherance of decisions
                                        that produce legal or similarly significant
                                        effects ("profiling")
                                    </li>
                                </ul>
                                <p>
                                    Depending upon the state where you live, you may also
                                    have the following rights:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)</li>
                                    <li>Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in California, Delaware, and Maryland)</li>
                                    <li>Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in Minnesota and Oregon)</li>
                                    <li>Right to obtain a list of third parties to which we have sold personal data (as permitted by applicable law, including the privacy law in Connecticut)</li>
                                    <li>Right to review, understand, question, and depending on where you live, correct how personal data has been profiled (as permitted by applicable law, including the privacy law in Connecticut and Minnesota)</li>
                                    <li>Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)</li>
                                    <li>Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)</li>
                                </ul>
                                <h3 className="serif italic text-xl text-navy">
                                    How to exercise your rights
                                </h3>
                                <p>
                                    To exercise these rights, you can contact us by
                                    submitting a{" "}
                                    <a href={`mailto:${EMAIL}?subject=Data%20Subject%20Access%20Request`} className="ed-link">
                                        data subject access request
                                    </a>
                                    , by emailing us at <Email />, or by referring to the
                                    contact details at the bottom of this document. Under
                                    certain US state data protection laws, you can
                                    designate an authorized agent to make a request on
                                    your behalf. We may deny a request from an authorized
                                    agent that does not submit proof that they have been
                                    validly authorized to act on your behalf in
                                    accordance with applicable laws.
                                </p>
                                <h3 className="serif italic text-xl text-navy">
                                    Request verification
                                </h3>
                                <p>
                                    Upon receiving your request, we will need to verify
                                    your identity to determine you are the same person
                                    about whom we have the information in our system. We
                                    will only use personal information provided in your
                                    request to verify your identity or authority to make
                                    the request. However, if we cannot verify your
                                    identity from the information already maintained by
                                    us, we may request that you provide additional
                                    information for the purposes of verifying your
                                    identity and for security or fraud-prevention
                                    purposes. If you submit the request through an
                                    authorized agent, we may need to collect additional
                                    information to verify your identity before processing
                                    your request and the agent will need to provide a
                                    written and signed permission from you to submit such
                                    request on your behalf.
                                </p>
                                <h3 className="serif italic text-xl text-navy">Appeals</h3>
                                <p>
                                    Under certain US state data protection laws, if we
                                    decline to take action regarding your request, you
                                    may appeal our decision by emailing us at <Email />.
                                    We will inform you in writing of any action taken or
                                    not taken in response to the appeal, including a
                                    written explanation of the reasons for the decisions.
                                    If your appeal is denied, you may submit a complaint
                                    to your state attorney general.
                                </p>
                            </Section>

                            <Section id="updates" num={11} title="Do we make updates to this notice?">
                                <InShort>
                                    Yes, we will update this notice as necessary to stay
                                    compliant with relevant laws.
                                </InShort>
                                <p>
                                    We may update this Privacy Notice from time to time.
                                    The updated version will be indicated by an updated
                                    "Revised" date at the top of this Privacy Notice. If
                                    we make material changes to this Privacy Notice, we
                                    may notify you either by prominently posting a notice
                                    of such changes or by directly sending you a
                                    notification. We encourage you to review this Privacy
                                    Notice frequently to be informed of how we are
                                    protecting your information.
                                </p>
                            </Section>

                            <Section id="contact" num={12} title="How can you contact us about this notice?">
                                <p>
                                    If you have questions or comments about this notice,
                                    you may email us at <Email /> or contact us by post
                                    at:
                                </p>
                                <p>
                                    Method Marketing Group LLC
                                    <br />
                                    2637 Collins Port Cv
                                    <br />
                                    Suwanee, GA 30024
                                    <br />
                                    United States
                                </p>
                            </Section>

                            <Section id="review-data" num={13} title="How can you review, update, or delete the data we collect from you?">
                                <p>
                                    Based on the applicable laws of your country or state
                                    of residence in the US, you may have the right to
                                    request access to the personal information we collect
                                    from you, details about how we have processed it,
                                    correct inaccuracies, or delete your personal
                                    information. You may also have the right to withdraw
                                    your consent to our processing of your personal
                                    information. These rights may be limited in some
                                    circumstances by applicable law. To request to
                                    review, update, or delete your personal information,
                                    please submit a{" "}
                                    <a href={`mailto:${EMAIL}?subject=Data%20Subject%20Access%20Request`} className="ed-link">
                                        data subject access request
                                    </a>
                                    .
                                </p>
                            </Section>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
