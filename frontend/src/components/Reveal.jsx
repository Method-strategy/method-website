import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal — scroll-triggered fade + translate for editorial "build" moments.
 * Restrained by design. Respects prefers-reduced-motion.
 *
 * Props:
 *  - as: element tag/component (default "div")
 *  - delay: seconds
 *  - y: initial translate-y in px (default 24)
 *  - duration: seconds (default 0.9)
 *  - amount: how much must be in view to trigger (0..1, default 0.2)
 *  - once: only trigger the first time (default true)
 */
export function Reveal({
    children,
    as: Tag = "div",
    delay = 0,
    y = 24,
    duration = 0.9,
    amount = 0.2,
    once = true,
    className = "",
    ...rest
}) {
    const reduce = useReducedMotion();
    const MotionTag = motion[Tag] || motion.div;

    if (reduce) {
        return (
            <Tag className={className} {...rest}>
                {children}
            </Tag>
        );
    }

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1]
            }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}

/**
 * RevealStagger — wraps a set of children and reveals them one after another.
 * Children automatically become <motion.div>-wrapped items via <RevealItem>.
 */
export function RevealStagger({
    children,
    className = "",
    stagger = 0.12,
    initialDelay = 0,
    amount = 0.2,
    once = true,
    ...rest
}) {
    const reduce = useReducedMotion();
    if (reduce) return <div className={className} {...rest}>{children}</div>;

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: stagger,
                        delayChildren: initialDelay
                    }
                }
            }}
            {...rest}
        >
            {children}
        </motion.div>
    );
}

export function RevealItem({
    children,
    as: Tag = "div",
    y = 24,
    duration = 0.9,
    className = "",
    ...rest
}) {
    const reduce = useReducedMotion();
    const MotionTag = motion[Tag] || motion.div;

    if (reduce) return <Tag className={className} {...rest}>{children}</Tag>;

    return (
        <MotionTag
            className={className}
            variants={{
                hidden: { opacity: 0, y },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration, ease: [0.16, 1, 0.3, 1] }
                }
            }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}

export default Reveal;
