/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

class CustomDocumentEditor extends Component {
    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.actionService = useService("action");
        
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
        const documentId = this.props.action.context.active_id;
        
        try {
            const doc = await this.orm.read(
                "documents.document",
                [documentId],
                ["name", "attachment_id"]
            );
            
            if (doc && doc[0]) {
                this.state.documentName = doc[0].name;
                
                if (doc[0].attachment_id) {
                    const attachment = await this.orm.read(
                        "ir.attachment",
                        [doc[0].attachment_id[0]],
                        ["datas"]
                    );
                    
                    if (attachment && attachment[0] && attachment[0].datas) {
                        this.state.content = atob(attachment[0].datas);
                    }
                }
                
                this.state.loading = false;
            }
        } catch (error) {
            this.notification.add("Error loading document", { type: "danger" });
            console.error(error);
            this.state.loading = false;
        }
    }

    async saveDocument() {
        const documentId = this.props.action.context.active_id;
        this.state.saving = true;

        try {
            const doc = await this.orm.read(
                "documents.document",
                [documentId],
                ["attachment_id"]
            );

            if (doc && doc[0] && doc[0].attachment_id) {
                const encodedContent = btoa(this.state.content);
                
                await this.orm.write(
                    "ir.attachment",
                    [doc[0].attachment_id[0]],
                    { datas: encodedContent }
                );

                this.notification.add("Document saved successfully", {
                    type: "success",
                });
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
        window.history.back();
    }
}

CustomDocumentEditor.template = "odoo_text_editor.DocumentEditor";

registry.category("actions").add("odoo_text_editor", CustomDocumentEditor);