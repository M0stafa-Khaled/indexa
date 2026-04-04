export const fadeInVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

export const fadeInItemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};
