import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../src/components/ui/breadcrumb";

export function BreadcrumbDemo({ currentFolder }) {
  if (!Array.isArray(currentFolder) || currentFolder.length === 0) {
    return null; // Return null or a fallback if the array is empty
  }

  // Assuming the last item in the array is the current folder
  const { path } = currentFolder[currentFolder.length - 1] || {};

  // Ensure path is a string, or fallback to an empty string
  const pathString = typeof path === "string" ? path : "";
  
  // Split path into parts and remove empty strings
  const pathParts = pathString.split("/").filter(Boolean);
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathParts.map((part, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index < pathParts.length - 1 ? (
                <BreadcrumbLink href={`/${pathParts.slice(0, index + 1).join("/")}`}>
                  {part}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{part}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
