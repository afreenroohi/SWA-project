export class Loader {
    private loader: any = {
        'GetTechnicalEvaluationCriteria': false,
        'SubmitTechnicalEvaluation': false,
    };

    /**
     * Return True if the section is loading
     * @param sectionCode 
     * @returns `boolean`
     */
    isSectionLoading(sectionCode: string): boolean {
        return this.loader[sectionCode] ?? false;
    }

    /**
     * Start the section loading
     * @param sectionCode 
     */
    startLoadingSection(sectionCode: string) {
        this.loader[sectionCode] = true;
    }

    /**
     * Stop the section loading
     * @param sectionCode 
     */
    stopLoadingSection(sectionCode: string) {
        this.loader[sectionCode]= false;
    }
}

export enum SectionCode {
    GetTechnicalEvaluationCriteria = 'GetTechnicalEvaluationCriteria',
    SubmitTechnicalEvaluation = 'SubmitTechnicalEvaluation'
}