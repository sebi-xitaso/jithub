export type IssueNumber = string & { _brand: "issue-number" };

export type Issue = {
    issueNumber: IssueNumber;
    parentIssue: IssueNumber | null;
    children: IssueNumber[];
    element: HTMLDivElement;
    isParent: boolean;
};

export function buildIssue(issue: HTMLDivElement): Issue | undefined {
    let issueNumber: IssueNumber | null = issue.getAttribute(
        "jib-issue-number"
    ) as IssueNumber;

    if (issueNumber === null) {
        const parsedIssueNumber = parseIssueNumber(issue);
        if (parsedIssueNumber === undefined) {
            return;
        }
        issueNumber = parsedIssueNumber;
        issue.setAttribute("jib-issue-number", issueNumber);
    }

    const issueTitle = parseIssueTitle(issue);

    if (issueTitle === undefined) {
        return;
    }

    issue.setAttribute(
        "jib-issue-type",
        issueTitle.isParent ? "parent" : "child"
    );

    return {
        issueNumber,
        parentIssue: issueTitle.parentIssue,
        element: issue,
        children: [],
        isParent: issueTitle.isParent,
    };
}

function parseIssueNumber(issue: HTMLDivElement): IssueNumber | undefined {
    const issueIdentifier = issue.querySelector("div span");

    if (issueIdentifier === null) {
        console.error(
            "[JIB] Failed to parse issue number: No identifier found!"
        );
        return;
    }

    const issueNumber =
        issueIdentifier.textContent?.match(/planfox-pf #(\d{4})/i) ?? null;

    if (issueNumber === null) {
        console.error(
            "[JIB] Failed to parse issue number: Invalid identifier found!"
        );
        return;
    }

    return issueNumber[1] as IssueNumber;
}

function parseIssueTitle(
    issue: HTMLDivElement
): { parentIssue: IssueNumber | null; isParent: boolean } | undefined {
    const issueTitle = issue.querySelector("a span");

    if (issueTitle === null) {
        console.error("[JIB] Failed to parse parent issue: No title found!");
        return;
    }

    if (issueTitle.textContent === null) {
        console.error(
            "[JIB] Failed to parse parent issue: Invalid title found!"
        );
        return;
    }

    const isParent = issueTitle.textContent.match(/\[PARENT\]/i) !== null;
    const parentIssueNumber = issueTitle.textContent.match(/\[(\d{4})\]/i);

    return {
        parentIssue: parentIssueNumber
            ? (parentIssueNumber[1] as IssueNumber)
            : null,
        isParent,
    };
}
