/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

class CustomDocumentEditor extends Component {
    setup() {
        this.rpc = useService("rpc");
        this.notification = useService("notification");
        
        this.state = useState({
            content: "",
            documentName: "",
            loading: true,
            saving: false,
        });

        onWillStart(async () => {
            await this.loadDocument();
        });
    }

    async loadDocument() {
        const documentId = this.props.action.params.document_id;
        
        try {
            const result = await this.rpc("/document/editor/get", {
                document_id: documentId,
            });

            if (result.success) {
                this.state.content = result.content;
                this.state.documentName = result.name;
                this.state.loading = false;
            } else {
                this.notification.add(
                    result.error || "Failed to load document",
                    { type: "danger" }
                );
            }
        } catch (error) {
            this.notification.add("Error loading document", { type: "danger" });
            console.error(error);
        }
    }

    async saveDocument() {
        const documentId = this.props.action.params.document_id;
        this.state.saving = true;

        try {
            const result = await this.rpc("/document/editor/save", {
                document_id: documentId,
                content: this.state.content,
            });

            if (result.success) {
                this.notification.add("Document saved successfully", {
                    type: "success",
                });
            } else {
                this.notification.add(
                    result.error || "Failed to save document",
                    { type: "danger" }
                );
            }
        } catch (error) {
            this.notification.add("Error saving document", { type: "danger" });
            console.error(error);
        } finally {
            this.state.saving = false;
        }
    }

    onContentChange(ev) {
        this.state.content = ev.target.value;
    }

    closeEditor() {
        this.props.close();
    }
}

CustomDocumentEditor.template = "odoo_text_editor.DocumentEditor";

registry.category("actions").add("odoo_text_editor", CustomDocumentEditor);