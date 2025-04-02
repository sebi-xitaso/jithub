import { buildIssue, Issue, IssueNumber } from "./issue";

export type Column = {
    element: HTMLDivElement;
    issues: Record<IssueNumber, Issue | undefined>;
    parents: IssueNumber[];
};

export function buildColumn(column: HTMLDivElement): Column | undefined {
    let issues: Record<
        IssueNumber,
        | (Omit<Issue, "element"> & { element: HTMLDivElement | null })
        | undefined
    > = {};
    let parents: IssueNumber[] = [];
    for (const issue of column.children) {
        const newIssue = buildIssue(issue as HTMLDivElement);
        if (newIssue === undefined) {
            return;
        }
        const oldIssue = issues[newIssue.issueNumber];
        if (oldIssue) {
            newIssue.children = oldIssue.children;
            if (!newIssue.isParent) {
                console.warn(
                    `[JIB] Found issue with children not marked as parent! issue number: ${newIssue.issueNumber}`
                );
                newIssue.isParent = true;
            }
        }
        issues[newIssue.issueNumber] = newIssue;

        if (newIssue.parentIssue === null) {
            continue;
        }

        const parentIssue = issues[newIssue.parentIssue];

        if (parentIssue === undefined) {
            issues[newIssue.parentIssue] = {
                issueNumber: newIssue.parentIssue,
                parentIssue: null,
                isParent: true,
                children: [newIssue.issueNumber],
                element: null,
            };
            parents.push(newIssue.parentIssue);
        } else {
            parentIssue.children.push(newIssue.issueNumber);
        }

        if (newIssue.isParent && oldIssue === undefined) {
            parents.push(newIssue.issueNumber);
        }
    }

    return {
        element: column,
        issues: issues as Record<IssueNumber, Issue | undefined>,
        parents: parents,
    };
}
