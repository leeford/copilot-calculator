// Format numbers with proper decimal places (if needed)
export const formatNumber = (value: number): string => {
    // Check if the number is an integer
    const isInteger = Number.isInteger(value);

    return value.toLocaleString(undefined, {
        minimumFractionDigits: isInteger ? 0 : 2,
        maximumFractionDigits: isInteger ? 0 : 2
    });
};