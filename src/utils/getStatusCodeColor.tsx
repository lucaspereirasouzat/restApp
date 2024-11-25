export function getStatusCodeColor(statusCode: number): string {
  const statusCategories = {
    informational: { range: [100, 199], color: "#5BC0DE" },
    success: { range: [200, 299], color: "#5CB85C" },
    redirection: { range: [300, 399], color: "#F0AD4E" },
    clientError: { range: [400, 499], color: "#D9534F" },
    serverError: { range: [500, 599], color: "#292B2C" },
  };

  for (const { range, color } of Object.values(statusCategories)) {
    if (statusCode >= range[0] && statusCode <= range[1]) {
      return color;
    }
  }

  return "#0000";
}
