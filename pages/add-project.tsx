import router from "next/router";
import React, { useRef } from "react";

export default function AddProject() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formRef.current) {
            const formData = new FormData(formRef.current);

            const projectData = {
                projectName: formData.get("projectName") as string,
                developerName: formData.get("developerName") as string,
                projectDescription: formData.get("projectDescription") as string,
                projectLink: formData.get("projectLink") as string,
            };

            const file = formData.get("image");

            if (file instanceof File) {
                const preSignedResponse = await fetch(
                    `/api/getPreSignedUrl?projectName=${encodeURIComponent(projectData.projectName)}&fileType=${file.type}`,
                    { method: "GET" }
                );

                if (preSignedResponse.ok) {
                    const { url, key } = await preSignedResponse.json();

                    const uploadResponse = await fetch(url, {
                        method: "PUT",
                        body: file,
                        headers: {
                            "Content-Type": file.type,
                        },
                    });

                    if (uploadResponse.ok) {
                        const response = await fetch("/api/addProject", {
                            method: "POST",
                            body: JSON.stringify({
                                ...projectData,
                                imageUrl: key,
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });

                        if (response.ok) {
                            router.push('/success');
                        } else {
                            console.log("Project data submission failed.");
                        }
                    } else {
                        console.log("File upload failed.");
                    }
                } else {
                    console.log("Failed to get pre-signed URL.");
                }
            } else {
                console.log("No file was uploaded.");
            }
        }
    };


    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="w-full max-w-lg"
                encType="multipart/form-data"
            >
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-full px-3 mb-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
                            Project Image
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            type="file"
                            name="image"
                            accept="image/*"
                            required
                        />
                    </div>
                    <div className="w-full md:w-full px-3">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
                            Project Name
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            type="text"
                            name="projectName"
                            required
                        />
                    </div>
                    <div className="w-full md:w-full px-3 mb-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
                            Developer Name
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            type="text"
                            name="developerName"
                            required
                        />
                    </div>
                    <div className="w-full md:w-full px-3 mb-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
                            Project Description
                        </label>
                        <textarea
                            className="no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-48 resize-none"
                            name="projectDescription"
                            required
                        />
                    </div>
                    <div className="w-full md:w-full px-3 mb-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
                            Project Links
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            type="url"
                            name="projectLink"
                            required
                        />
                    </div>
                    <div className="w-full md:w-full px-3">
                        <button
                            className="shadow bg-slate-500 hover:bg-slate-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
