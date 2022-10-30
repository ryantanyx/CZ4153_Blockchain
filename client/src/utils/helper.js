// Returns the odds bar color background
export const getBarBackground = (gameInfo) => {
    const green = parseInt(gameInfo.betA);
    const red = parseInt(gameInfo.betB);
    if (green + red === 0) {
        return 'linear-gradient(to right, #12892193 50%, #FA121193 50%)'
    } 
    const greenRatio = Math.round((green / (green + red)) * 100);
    const redRatio = 100 - greenRatio;
    return 'linear-gradient(to right, #12892193 ' + greenRatio + '%, #FA121193 ' + redRatio + '%)';
}