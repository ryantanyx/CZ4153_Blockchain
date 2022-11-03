// Returns the odds bar color background
export const getBarBackground = (gameInfo) => {
    // Ratio of green to red is inverse of ratio of internal tokens A to B
    const green = parseInt(gameInfo.internalTokenB);
    const red = parseInt(gameInfo.internalTokenA);
    if (green + red === 0) {
        return 'linear-gradient(to right, #12892193 50%, #FA121193 50%)'
    } 
    const greenRatio = Math.round((green / (green + red)) * 100);
    return 'linear-gradient(to right, #12892193 0% ' + greenRatio + '%, #FA121193 ' + greenRatio + '% 100%)';
}

// Returns datetime string given epoch unix time
export const getDateTimeString = (epochTime) => {
    return (new Date(epochTime * 1000)).toLocaleString();
}