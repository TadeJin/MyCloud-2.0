"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActionButton, useDialog, useErrors, useFiles, useFolders } from ".";
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
            <ActionButton className="gap-1 p-2 h-9 md:h-10" onClick={handleClick}>
                <FolderPlusIcon />
                <p className="text-xs md:hidden">Create</p>
                <p className="hidden md:block">Create Folder</p>
            </ActionButton>
        </div>
    )
};
