import { format } from "date-fns";
export const handleDownloadImage = async (imageUrl, brandName, platformName, type, date,) => {
    const fileName = `${brandName}-${platformName}-${type}-${format(date, 'dd-MM-yy')}`
    // Fetch the image data as a Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a temporary object URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const link = document.createElement("a");
    // Set the href to the Blob URL
    link.href = url;
    // Set the download attribute to suggest a filename
    link.setAttribute("download", fileName);

    // Append the link to the body
    document.body.appendChild(link);
    // Programmatically click the link to trigger the download
    link.click();
    // Remove the link from the document
    document.body.removeChild(link);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(url);
};