"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDialog, useErrors, useFiles, useFolders } from ".";
import { FolderPlusIcon } from ".";
import { useTRPC } from "../lib/trpc/client";
import { TRPCClientError } from "@trpc/client";

export const CreateFolderButton = () => {
    const queryClient = useQueryClient();
    const {setActiveFile} = useFiles();
    const {setDialogVisible, setDialogProps} = useDialog();
    const {getOpenedFolderID, folderStackIDs} = useFolders();
    const {setErrorMessage} = useErrors();
    const trpc = useTRPC();

    const createFolder = async (newName: string) => {
        setDialogVisible(false);

        try {
            await checkDuplicatesMutation.mutateAsync({fileNames: [newName], folderId: getOpenedFolderID()});
        } catch (err) {
            if (err instanceof TRPCClientError) {
                setErrorMessage(err.message);
                return
            }
        }

        try {
            await createFolderMutation.mutateAsync({name: newName, folderId: getOpenedFolderID(), folderStackIDs: folderStackIDs});
        } catch (err) {
            if (err instanceof TRPCClientError) {
                setErrorMessage(err.message);
                return
            }
        }

        queryClient.invalidateQueries(trpc.files.fetchFolders.queryFilter());
    }

    const checkDuplicatesMutation = useMutation(trpc.files.checkDuplicates.mutationOptions());
    const createFolderMutation = useMutation(trpc.files.createFolder.mutationOptions());


    const handleClick = () => {
        setActiveFile({id: -1, mimeType: "", name: "", variant: "folder", isCorrupted: false});
        setDialogProps({headerText: "Enter new folder name:", hasInput: true, onSubmit: createFolder})
        setDialogVisible(true);
    }

    return (
         <div className="flex flex-col w-[80%]">
            <button className="flex items-center gap-1 p-2 bg-stone-50 dark:bg-dark-card border border-stone-200 dark:border-dark-border rounded-md hover:bg-stone-100 dark:hover:bg-dark-hover hover:border-stone-300 dark:hover:border-dark-border-strong cursor-pointer shadow-sm hover:shadow-md transition-all duration-100 dark:text-dark-text-primary" onClick={handleClick}>
                <FolderPlusIcon size={24} />
                <p className="text-xs md:hidden">Create</p>
                <p className="hidden md:block">Create Folder</p>
            </button>
        </div>
    )
};
